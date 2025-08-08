import express from "express";

import { createReadStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
const pipelineAsync = promisify(pipeline);

import split from "split2";

import type { DiskStoredFile } from "../../domain/common/file.js";
import { CSVService } from "../../services/csv_service.js";
import { StreamService } from "../../services/stream.js";
import { isValidDate } from "../../utils/date.js";
import { FileMiddleware } from "../middlewares/handle_file.js";

import { PrismaClient } from "../../../generated/prisma/client.js";
import type { AddTransactionsModel } from "../../domain/repositories/transactions.js";

const BATCH_SIZE = 100;

const transactionsRouter = express();

const fileMiddleware = new FileMiddleware();
const prisma = new PrismaClient();

transactionsRouter.post(
  "/csv",
  fileMiddleware.handleMultipleFilesOnDiskStorage,
  async (req, res) => {
    const files = req?.files as DiskStoredFile[];
    if (!files) return res.status(422).json({ message: "No files provided" });

    const onlyCsvFiles = new CSVService().validateFiles(files);
    const streams = onlyCsvFiles.map((file) => createReadStream(file.path));
    const stream = new StreamService().concatStreams(streams);

    // Poderiamos pensar nessa function sem o async
    async function* validTransactionData(
      source: AsyncIterable<string>
    ): AsyncGenerator<AddTransactionsModel> {
      for await (const line of source) {
        const [date, value, _id, description] = line.split(",");

        if (!date || !value || !description) continue;

        if (!isValidDate(date)) continue;
        const transformedValue = (parseFloat(value) * 100).toFixed(0);
        if (isNaN(parseFloat(transformedValue))) continue;

        yield {
          date: new Date(date),
          unit_amount: parseFloat(transformedValue),
          description,
        };
      }
    }

    const batch: AddTransactionsModel[] = [];

    async function* addTransactionsOnDatabase(
      source: AsyncIterable<AddTransactionsModel>
    ) {
      for await (const data of source) {
        batch.push(data);

        if (batch.length >= BATCH_SIZE) {
          await prisma.transaction.createMany({
            data: batch,
          });

          batch.length = 0;
        }
      }

      if (batch.length > 0) {
        await prisma.transaction.createMany({
          data: batch,
        });
      }
    }

    await pipelineAsync(
      stream,
      split(),
      validTransactionData,
      addTransactionsOnDatabase
    );

    res.status(201).json({ message: "Transactions added successfully" });
  }
);

export { transactionsRouter };
