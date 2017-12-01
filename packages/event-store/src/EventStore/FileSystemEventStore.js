/* @flow */

import assert from 'assert';
import fs from 'fs';
import { promisify } from 'util';
import { EventStore } from './../EventStore';
import NormalizedEvent from './../NormalizedEvent';
import type { EventSerializer } from './../EventSerializer';
import JsonNormalizedEventSerializer from './../EventSerializer/JsonNormalizedEventSerializer';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export default class FileSystemEventStore implements EventStore {
  storagePath: string;
  eventSerializer: EventSerializer;

  constructor(storagePath: string, eventSerializer: EventSerializer) {
    assert(!!storagePath);
    assert(!!eventSerializer);

    this.storagePath = storagePath;
    this.eventSerializer = eventSerializer;
  }

  // TODO: Use buffer to serialize the data and use stream to write it on the filesystem
  // TODO: Manage simple write concurency use case
  async commit(
    streamName: string,
    history: Array<NormalizedEvent>,
  ): Promise<void> {
    const payload = history
      .map(normalizedEvent => ({
        stream_name: streamName,
        event: this.eventSerializer.serialize(normalizedEvent),
      }))
      .map(data => JSON.stringify(data))
      .join('\n');

    return await writeFile(this.storagePath, payload, {
      encoding: 'utf8',
      flag: 'a',
    });
  }

  // TODO: Use buffer to read the data on the filesystem and filter/serialize on the fly
  async fetchHistoryFor(streamName: string): Promise<Array<NormalizedEvent>> {
    const content = await readFile(this.storagePath, {
      encoding: 'utf8',
      flag: fs.constants.O_RDONLY,
    });

    return content
      .split('\n')
      .map(line => JSON.parse(line))
      .filter(payload => payload.stream_name === streamName)
      .map(({ event }) => this.eventSerializer.deserialize(event));
  }
}
