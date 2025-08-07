import express from "express";

import { createReadStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
const pipelineAsync = promisify(pipeline);

import split from "split2";

import type { DiskStoredFile } from "../../domain/common/file.js";
import { CSVService } from "../../services/csv_service.js";
import { StreamService } from "../../services/stream.js";
import { FileMiddleware } from "../middlewares/handle_file.js";

const transactionsRouter = express();

const fileMiddleware = new FileMiddleware();

transactionsRouter.post(
  "/csv",
  fileMiddleware.handleMultipleFilesOnDiskStorage,
  async (req, res) => {
    const files = req?.files as DiskStoredFile[];
    if (!files) return res.status(422).json({ message: "No files provided" });

    const onlyCsvFiles = new CSVService().validateFiles(files);
    const streams = onlyCsvFiles.map((file) => createReadStream(file.path));
    const stream = new StreamService().concatStreams(streams);

    await pipelineAsync(stream, split(), async function* (source) {
      for await (const line of source) {
        const [date, value, _id, description] = line.split(",");
        yield { date, value, description };
      }
    });

    res.status(200).json({ message: "Files processed successfully" });
  }
);

export { transactionsRouter };
