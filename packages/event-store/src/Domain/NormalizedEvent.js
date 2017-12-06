/* @flow */

import assert from 'assert';

type PrimitiveEventData =
  | number
  | string
  | boolean
  | Array<PrimitiveEventData>
  | { [key: string]: PrimitiveEventData };

export default class NormalizedEvent {
  uid: string;
  type: string;
  data: PrimitiveEventData;
  metadata: PrimitiveEventData;
  version: number;

  constructor(
    uid: string,
    type: string,
    data: { [key: string]: PrimitiveEventData },
    metadata: { [key: string]: PrimitiveEventData } = {},
    version: number = 0,
  ) {
    assert(uid);
    assert(type);
    assert(data);
    assert(metadata);
    assert(version >= 0);

    this.uid = uid;
    this.type = type;
    this.data = data;
    this.metadata = metadata;
    this.version = version;
  }
}
