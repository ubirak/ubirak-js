/* @flow */

import fs from 'fs';
import { Readable, Writable, PassThrough } from 'stream';
import jsonlines from 'jsonlines';
import { stringify } from 'querystring';
import { FileSystemAdapter } from './../FileSystemAdapter';
import { transformify } from './../../../utils/stream';

const filterByStreamNameStream = (streamName: string) => {
  return transformify(
    (data, encoding, cb) =>
      data.stream_name === streamName ? cb(null, data) : cb(null, ''),
  );
};

const extractPayloadStream = () => {
  return transformify((data, encoding, cb) => cb(null, data.event));
};

const encapsulatePayloadStream = (streamName: string) => {
  return transformify((data, encoding, cb) =>
    cb(null, { stream_name: streamName, event: data }),
  );
};

export default class OneJSONLinesFileSystemAdapter
  implements FileSystemAdapter {
  filepath: string;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  writeFor(streamName: string): Writable {
    const passThrough = new PassThrough({ objectMode: true });

    const writter = fs.createWriteStream(this.filepath, {
      encoding: 'utf8',
      flags: 'a',
    });
    writter.on('error', err => passThrough.emit('error', err));
    const encapsulatePayload = encapsulatePayloadStream(streamName);
    encapsulatePayload.on('error', err => passThrough.emit('error', err));

    const stringifyLine = jsonlines.stringify();
    stringifyLine.on('error', err => passThrough.emit('error', err));

    return passThrough
      .pipe(encapsulatePayload)
      .pipe(stringifyLine)
      .pipe(writter);
  }

  readFor(streamName: string): Readable {
    const readFile = fs.createReadStream(this.filepath, {
      encoding: 'utf8',
      flag: fs.constants.O_RDONLY,
    });

    const parseLine = jsonlines.parse();
    parseLine.on('error', err => readFile.emit('error', err));

    const filterByStreamName = filterByStreamNameStream(streamName);
    filterByStreamName.on('error', err => readFile.emit('error', err));

    const extractPayload = extractPayloadStream();
    extractPayload.on('error', err => readFile.emit('error', err));

    return readFile
      .pipe(parseLine)
      .pipe(filterByStreamName)
      .pipe(extractPayload);
  }
}
