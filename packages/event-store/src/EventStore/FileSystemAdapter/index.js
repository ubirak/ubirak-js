/* @flow */

import stream from 'stream';

export interface FileSystemAdapter {
  writeFor(streamName: string): stream.Writable;
  readFor(streamName: string): stream.Readable;
}
