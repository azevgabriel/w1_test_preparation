import express from "express";
import multer from "multer";

import { pipeline } from "node:stream";
import { promisify } from 'node:util';
const pipelineAsync = promisify(pipeline);

import split from 'split2';

import { CSVService } from "../../services/csv_service.js";
import { StreamService } from "../../services/stream.js";
import type { FileProperties } from "../../domain/services/file.js";

const uploadMiddleware = multer({ dest: 'tmp/' });
const transactionsRouter = express.Router();

transactionsRouter.post('/csv', uploadMiddleware.array('transactions'), async (req, res) => {
    const files = req?.files;
    if (!files)
        return res.status(422).json({ message: 'No files provided' });

    const onlyCsvFiles = new CSVService().validateFiles(files as FileProperties[]);
    const streams = onlyCsvFiles.map(file => file.stream);
    const stream = new StreamService().concatStreams(streams);

    return pipelineAsync(
        stream, 
        split(), 
        async function* (source) {
            for await (const line of source) {
            
                console.log(line);
                yield line;
            }
        }
    );
});