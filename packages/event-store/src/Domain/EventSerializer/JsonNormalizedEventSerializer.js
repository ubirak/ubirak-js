/* @flow */

import assert from 'assert';
import { Transform } from 'stream';
import NormalizedEvent from './../NormalizedEvent';
import { EventSerializer } from './../EventSerializer';
import { transformify } from './../../utils/stream';

export default class JsonNormalizedEventSerializer implements EventSerializer {
  serialize(normalizedEvent: NormalizedEvent) {
    assert(
      normalizedEvent instanceof NormalizedEvent,
      'Should be a NormalizedEvent',
    );

    const { uid, type, data, metadata } = normalizedEvent;

    return JSON.stringify({ uid, type, data, metadata });
  }

  deserialize(data: string) {
    assert(data);

    const payload = JSON.parse(data);

    return new NormalizedEvent(
      payload.uid,
      payload.type,
      payload.data,
      payload.metadata,
    );
  }

  deserializeStream(): Transform {
    return transformify((data, encoding, cb) =>
      cb(null, this.deserialize(data)),
    );
  }
}
