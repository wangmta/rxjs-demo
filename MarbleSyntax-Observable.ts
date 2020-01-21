import { TestScheduler } from 'rxjs/testing';

let scheduler = new TestScheduler((actual, expected) => {});

scheduler.run(helpers => {
  // each char is one frame(millisecond) in the virtual timer
  // - means time passing
  // letters means values
  helpers.cold('-a-b-c');
  // | is complete symbol
  helpers.cold('--a-4---c-8|');
  // white space is ignored, no meaning, for easy readability
  // 12ms: alernative for 12 - , m is minute, s is second, 12ms must have white spaces at both sides, so it's not treated as value produced
  // # is error produced by OB
  helpers.cold('  --a-4 12ms c-8#');

  // ^ only applies to hot OB, meaning the start of subscription
  // (cde) means values occurs synchronously in the same frame, not for hot OB only
  helpers.cold('-a-^_b_(cde)---f|');
});
