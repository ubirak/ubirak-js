import JsonNormalizedEventSerializer from './JsonNormalizedEventSerializer';
import NormalizedEvent from './../NormalizedEvent';

describe('JsonNormalizedEventSerializer', () => {
  it('should serialize to a string a NormalisedDomainEvent', () => {
    const event = new NormalizedEvent(
      'aaa',
      'bbb',
      { foo: 'Hello World', bar: 42 },
      { created_at: 'now' },
    );

    const sut = new JsonNormalizedEventSerializer();

    expect(sut.serialize(event)).toEqual(
      '{"uid":"aaa","type":"bbb","data":{"foo":"Hello World","bar":42},"metadata":{"created_at":"now"}}',
    );
  });

  it('should only accept NormalizedEvent', () => {
    const sut = new JsonNormalizedEventSerializer();

    expect(() => sut.serialize('foo')).toThrow('Should be a NormalizedEvent');
  });

  it('should instranciate a NormaliedEvent from a string', () => {
    const fixture =
      '{"uid":"aaa","type":"bbb","data":{"foo":"Hello World","bar":42},"metadata":{"created_at":"now"}}';

    const sut = new JsonNormalizedEventSerializer();

    expect(sut.deserialize(fixture)).toEqual(
      new NormalizedEvent(
        'aaa',
        'bbb',
        { foo: 'Hello World', bar: 42 },
        { created_at: 'now' },
      ),
    );
  });
});
