import { Readable } from 'stream';

export interface FileProperties {
    fieldname: string;
    originalname: string;
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
    stream: Readable;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}