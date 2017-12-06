/* @flow */

import stream from 'stream';

export const transformify = (
  fn: (
    data: any,
    encoding: string,
    cb: (err: ?Error, value: ?any) => void,
  ) => any,
): stream.Transform => {
  return new stream.Transform({
    objectMode: true,
    transform: (data, encoding, cb) => fn(data, encoding, cb),
  });
};
