import type { Readable } from 'node:stream';
import type { FileProperties } from '../domain/services/file.js';

export class CSVService {
    #VALID_MIME_TYPES = ['text/csv'];

    validateFiles(files: FileProperties[]) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('No files provided for CSV parsing');
        }

        return files.filter(file => {
            return this.#VALID_MIME_TYPES.includes(file.mimetype);
        });
    }

    parseCSV(csvStreams: Readable[]) {
        // Implement CSV parsing logic here
        // This is a placeholder implementation
        return csvStreams.map(stream => {
            // Parse each stream and return the parsed data
            return []; // Replace with actual parsed data
        });
    }
}