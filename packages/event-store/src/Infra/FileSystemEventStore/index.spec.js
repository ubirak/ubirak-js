/* @flow */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { promisify } from 'util';
import NormalizedEvent from './../../Domain/NormalizedEvent';
import JsonNormalizedEventSerializer from './../../Domain/EventSerializer/JsonNormalizedEventSerializer';
import FileSystemEventStore from './';

const generateTmpDirectory = () =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'ubirak-js-'));
const recurcivelyDeleteDirectory = (path: string) =>
  execSync(`rm -r "${path}"`);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

let playgroundDirectory;
beforeEach(() => {
  playgroundDirectory = generateTmpDirectory();
});

afterEach(() => {
  recurcivelyDeleteDirectory(playgroundDirectory);
});

describe('FileSystemEventStore', () => {
  it('should commit normalized event to a given stream on the filesystem', async () => {
    const storageFilepath = path.join(playgroundDirectory, 'foo.jsonl');

    const fakeSerializer = new JsonNormalizedEventSerializer();
    fakeSerializer.serialize = jest.fn(() => 'mocked serialization');

    const sut = new FileSystemEventStore(storageFilepath, fakeSerializer);

    await sut.commitToStream('stream-a', [
      new NormalizedEvent('aaa-aaa', 'something.was.done', {}),
      new NormalizedEvent('bbb-bbb', 'something-else.was.done', {}),
    ]);

    await sut.commitToStream('stream-b', [
      new NormalizedEvent('ccc-ccc', 'another-thing.was.done', {}),
    ]);

    const fileContent = await readFile(storageFilepath, { encoding: 'utf8' });

    expect(fileContent)
      .toBe(`{"stream_name":"stream-a","event":"mocked serialization"}
{"stream_name":"stream-a","event":"mocked serialization"}
{"stream_name":"stream-b","event":"mocked serialization"}
`);
  });

  it('should read events from a given stream on the filesystem', async () => {
    const storageFilepath = path.join(playgroundDirectory, 'foo.jsonl');

    const fakeSerializer = new JsonNormalizedEventSerializer();
    fakeSerializer.deserialize = jest.fn(
      () => new NormalizedEvent('aaa-aaa', 'something.was.done', {}),
    );

    const sut = new FileSystemEventStore(storageFilepath, fakeSerializer);

    const fixture = [
      `{"stream_name":"data-a","event":"one"}`,
      '{"stream_name":"data-b","event":"two"}',
      '{"stream_name":"data-a","event":"three"}',
    ];

    await writeFile(storageFilepath, fixture.join('\n'), { encoding: 'utf8' });

    const events = await sut.fetchStream('data-a');

    expect(events.length).toBe(2);
  });
});
