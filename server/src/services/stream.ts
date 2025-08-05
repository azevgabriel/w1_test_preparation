import StreamConcat from "stream-concat";
import type { Readable } from 'node:stream';

export class StreamService {
    concatStreams(streams: Readable[]): Readable {
        return new StreamConcat(streams);
    }
}