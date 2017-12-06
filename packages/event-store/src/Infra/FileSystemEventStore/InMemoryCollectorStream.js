/* @flow */

import { Writable } from 'stream';

export default class InMemoryCollectorStream extends Writable {
  collection: Array<any>;

  constructor() {
    super({ objectMode: true });

    this.collection = [];
  }

  _write(data, encoding, cb) {
    this.collection.push(data);
    cb();
  }

  collect(): Array<any> {
    return this.collection;
  }
}
