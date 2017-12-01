/* @flow */

import assert from 'assert';
import NormalizedEvent from './../NormalizedEvent';

export default class JsonNormalizedEventSerializer {
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
}
