/* @flow */

import assert, { throws } from 'assert';
import fs from 'fs';
import jsonlines from 'jsonlines';
import { Readable, Transform, Writable } from 'stream';
import streamify from 'stream-array';
import { EventStore } from './../EventStore';
import NormalizedEvent from './../NormalizedEvent';
import type { EventSerializer } from './../EventSerializer';
import JsonNormalizedEventSerializer from './../EventSerializer/JsonNormalizedEventSerializer';
import { FileSystemAdapter } from './FileSystemAdapter';
import JSONLinesFileSystemAdapter from './FileSystemAdapter/JSONLinesFileSystemAdapter';
import InMemoryCollectorStream from './InMemoryCollectorStream';

export default class FileSystemEventStore implements EventStore {
  eventSerializer: EventSerializer;
  fileSystemAdapter: FileSystemAdapter;

  constructor(storagePath: string, eventSerializer: EventSerializer) {
    assert(!!storagePath);
    assert(!!eventSerializer);

    this.fileSystemAdapter = new JSONLinesFileSystemAdapter(storagePath);
    this.eventSerializer = eventSerializer;
  }

  async commit(
    streamName: string,
    history: Array<NormalizedEvent>,
  ): Promise<void> {
    const storableEvents = history.map(normalizedEvent => ({
      stream_name: streamName,
      event: this.eventSerializer.serialize(normalizedEvent),
    }));

    return new Promise((resolve, reject) => {
      const storableEventsStream = streamify(storableEvents);
      storableEventsStream.on('error', err => reject(err));

      const stringify = jsonlines.stringify();
      stringify.on('error', err => reject(err));

      const writter = this.fileSystemAdapter.writeFor(streamName);
      writter.on('error', err => reject(err));
      writter.on('finish', () => resolve());

      storableEventsStream.pipe(stringify).pipe(writter);
    });
  }

  async fetchHistoryFor(streamName: string): Promise<Array<NormalizedEvent>> {
    return new Promise((resolve, reject) => {
      const storedEventReadder = this.fileSystemAdapter.readFor(streamName);
      storedEventReadder.on('error', err => reject(err));

      const deserialize = this.eventSerializer.deserializeStream();
      deserialize.on('err', err => reject(err));

      const inMemoryCollector = new InMemoryCollectorStream();
      inMemoryCollector.on('err', err => reject(err));

      storedEventReadder.on('end', () => {
        resolve(inMemoryCollector.collect());
      });

      storedEventReadder.pipe(deserialize).pipe(inMemoryCollector);
    });
  }
}
