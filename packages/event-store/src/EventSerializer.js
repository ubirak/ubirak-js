/* @flow */

import NormalizedEvent from './NormalizedEvent';

export interface EventSerializer {
  serialize(normalizedEvent: NormalizedEvent): string;
  deserialize(str: string): NormalizedEvent;
}
