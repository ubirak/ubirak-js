/* @flow */

import NormalizedEvent from './NormalizedEvent';

export interface EventStore {
  // TODO: Manage concurency strategy on commit
  commit(streamName: string, history: Array<NormalizedEvent>): Promise<void>;

  fetchHistoryFor(streamName: string): Promise<Array<NormalizedEvent>>;
}
