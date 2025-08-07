import type { Request, Response } from "express";
import type { NextFunction } from "express-serve-static-core";
import multer from "multer";

export class FileMiddleware {
/**
 * Não é indicado para arquivos muito grandes, pois armazena tudo na memória.
 */
  handleMultipleFilesOnMemoryStorage(req: Request, res: Response, next: NextFunction) {
    const upload = multer({ storage: multer.memoryStorage() });
    upload.array('files')(req, res, (err) => {
      if (err) 
        return res
          .status(500)
          .json({ 
            message: 'File upload failed',
            error: err.message 
          });

      next();
    });
  }

  handleMultipleFilesOnDiskStorage(req: Request, res: Response, next: NextFunction) {
    const upload = multer({ dest: 'tmp/' });
    upload.array('files')(req, res, (err) => {
      if (err) 
        return res
          .status(500)
          .json({ 
            message: 'File upload failed',
            error: err.message 
          });

      next();
    });
  }
}