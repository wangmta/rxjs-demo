import { TestScheduler } from 'rxjs/testing';

// create a test scheduler
let scheduler = new TestScheduler((actual, expected) => {
  // perform deep equality test
});

// call the run()

scheduler.run(helpers => {
  // use 5 methods on "helpers" object to test code
  // helpers.cold() // returns a cold OB
  // helpers.hot() // returns a hot OB
  // helpers.expectObservable()
  // helpers.expectSubscriptions()
  // helpers.flush() // starts the virtual timer inside the TestScheduler, this is rarely called since the timers runs automatically when callback function runs in the run() method
});
