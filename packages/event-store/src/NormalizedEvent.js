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

  constructor(
    uid: string,
    type: string,
    data: { [key: string]: PrimitiveEventData },
    metadata: { [key: string]: PrimitiveEventData } = {},
  ) {
    assert(uid);
    assert(type);
    assert(data);

    this.uid = uid;
    this.type = type;
    this.data = data;
    this.metadata = metadata;
  }
}
