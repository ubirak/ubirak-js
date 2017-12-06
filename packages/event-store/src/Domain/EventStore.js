/* @flow */

import NormalizedEvent from './NormalizedEvent';

export interface EventStore {
  commitToStream(
    streamName: string,
    history: Array<NormalizedEvent>,
    expectedVersion?: number,
  ): Promise<void>;

  fetchStream(streamName: string): Promise<Array<NormalizedEvent>>;

  deleteStream(streamName: string): Promise<void>;
}
