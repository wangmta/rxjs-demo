import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
import { delay, take } from 'rxjs/operators';

describe('Test Name: RXJS Test', () => {
  let scheduler: TestScheduler;

  // run before each individual test
  beforeEach(() => {
    // get a new instance for each test
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).deep.equal(expected);
    });
  });

  it('test 1: should produce a single value and completion message', () => {
    scheduler.run(helpers => {
      const source$ = helpers.cold('a|');
      const expected = 'a|';

      helpers.expectObservable(source$).toBe(expected);
    });
  });

  it('test 2: should delay the value produced.', () => {
    scheduler.run(helpers => {
      const source$ = helpers.cold('-a-b-c-d|');
      // delay 5 frames
      const expected = '       ------a-b-c-d|';
      // const expected = '       5ms a-b-c-d|';

      helpers.expectObservable(source$.pipe(delay(5))).toBe(expected);
    });
  });

  it('test 3: should stops at the correct frame', () => {
    scheduler.run(helpers => {
      const source$ = helpers.cold('-a-b-c-d|');
      // last value and complete message actually emits at the same frame
      const expected = '            -a-b-(c|)';
      // the last one stops at the opening parenthesis
      const subscription = '        ^----!';

      helpers.expectObservable(source$.pipe(take(3))).toBe(expected);

      // source$.subscriptions gets the config of the sub
      helpers.expectSubscriptions(source$.subscriptions).toBe(subscription);
    });
  });
});
