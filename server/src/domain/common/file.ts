import { Readable } from 'stream';

export interface FileProperties {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
}

export interface DiskStoredFile extends FileProperties {
    destination: string;
    filename: string;
    path: string; 
}

export interface MemoryStoredFile extends FileProperties {
    buffer: Buffer;
}