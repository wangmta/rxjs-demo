// an Obsrevable is not executed until an object subscribes to it
import {
  Observable,
  Subscriber,
  throwError,
  Subject,
  interval,
  ConnectableObservable,
  asapScheduler,
  asyncScheduler,
  queueScheduler,
  merge,
  combineLatest,
  BehaviorSubject,
  timer,
  forkJoin,
  race
} from 'rxjs';
// all these functions can create Observables
import { of, from, concat, fromEvent } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax } from 'rxjs/ajax';
import {
  mergeMap,
  filter,
  tap,
  catchError,
  take,
  takeUntil,
  multicast,
  refCount,
  publish,
  share,
  publishLast,
  publishBehavior,
  publishReplay,
  observeOn,
  map,
  toArray,
  debounceTime,
  delay,
  mapTo
} from 'rxjs/operators';
import { AsapScheduler } from 'rxjs/internal/scheduler/AsapScheduler';
import { async } from 'rxjs/internal/scheduler/async';
import { ReplaySubject } from 'rxjs';

//#region Observerables fundamentals

// Subscriber VS Observer: A subscriber function receives an Observer object, and can publish values to the observer's next() method.

// function subscribe(subscriber) {
//   for (let book of allBooks) {
//     subscriber.next(book);
//   }
// }

// // let allBooksObservable$ = new Observable(subscribe);

// let allBooksObservable$ = new Observable(subscriber => {
//   if (document.title !== 'RxBookTracker') {
//     subscriber.error('Incorrect page title');
//   }

//   for (let book of allBooks) {
//     subscriber.next(book);
//   }

//   setTimeout(() => {
//     subscriber.complete();
//   }, 2000);

//   return () => console.log('Executing clean up code');
// });

// allBooksObservable$.subscribe(book => {
//   console.log(book['title']);
// });

// // call either subscriber.error or subscriber.complete will terminate the loop, no next() will be called
// let source1$ = of('hello', 10, true, allReaders[0].name);
// source1$.subscribe(value => console.log(value));

// let source2$ = from(allBooks);
// source2$.subscribe(book => console.log(book.title));

// // concat observables into 1
// concat(source1$, source2$).subscribe(value => console.log(value));

// let button = document.getElementById('readersButton');

// // user event triggered observable
// // fromEvent(button, 'click').subscribe(event => {
// //   console.log(event);

// //   let readersDiv = document.getElementById('readers');

// //   for (let reader of allReaders) {
// //     readersDiv.innerHTML += reader.name + '<br>';
// //   }
// // });

// // from ajax call
// fromEvent(button, 'click').subscribe(event => {
//   ajax('api/readers').subscribe(ajaxResponse => {
//     console.log(ajaxResponse);
//     let readers = ajaxResponse.response;
//     let readersDiv = document.getElementById('readers');

//     for (let reader of readers) {
//       readersDiv.innerHTML += reader.name + '<br>';
//     }
//   });
// });
//#endregion

//#region Observer in 2 formats

// let books$ = from(allBooks);

// let booksObserver = {
//   next: book => console.log(book.title),
//   error: err => console.log(err),
//   complete: () => console.log('all done listing books')
// };

// // books$.subscribe(booksObserver);

// books$.subscribe(
//   book => console.log(book.title),
//   err => console.log(err),
//   () => console.log('all done listing books')
// );

//#endregion

//#region Multiple observers

// let currentTime$ = new Observable(subscriber => {
//   const timeString = new Date().toLocaleTimeString();
//   subscriber.next(timeString);
//   subscriber.complete();
// });

// currentTime$.subscribe(currentTime => console.log(`Observer 1: ${currentTime}`));

// setTimeout(() => {
//   currentTime$.subscribe(currentTime => console.log(`Observer 2: ${currentTime}`));
// }, 1000);

// setTimeout(() => {
//   currentTime$.subscribe(currentTime => console.log(`Observer 3: ${currentTime}`));
// }, 2000);

//#endregion

//#region Operators
// mergeMap flattens OB to new OB

//Tap: Perform a side effect for every emission on the source Observable, but return an Observable that is identical to the source.
// each operator returns an OBservable and passed to next operator

// ajax('/api/books')
//   // ajax('/api/errors/500')
//   .pipe(
//     mergeMap(ajaxResponse => ajaxResponse.response),
//     filter(book => book['publicationYear'] < 1950),
//     tap(oldBook => console.log(`Title: ${oldBook['title']}`)),
//     // catchError(err => of({ title: 'MyBook', author: 'Me' })), // option 1: this obj will be treated as finalValue and replace previous value, it will not be passed to error
//     // catchError((err, caught) => caught) // option 2: caught is the OB that produce the error, this code will cause retry
//     // catchError(err => {
//     //   throw `Error happens - ${err.message}`;
//     //   // option 3: this error will be catched by error object
//     // })
//     catchError(err => {
//       return throwError(err.message);
//     }) // option 4: this is similar to option 3, but this returns an OB
//   )
//   .subscribe(
//     finalValue => console.log(`VALUE: ${finalValue['title']}`),
//     error => console.log(`ERROR: ${error}`)
//   );

// catchError can catch error from the above operators and returns a OB

//#endregion

//#region take, takeUntil, cancel subscription

// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');

// let timer$ = new Observable(subscriber => {
//   let i = 0;
//   let intervalID = setInterval(() => {
//     subscriber.next(i++);
//   }, 1000);
//   return () => {
//     console.log('Executing teardown code.');
//     clearInterval(intervalID);
//   };
// });

// let cancelTimer$ = fromEvent(button, 'click'); // it will produce a value when button is clicked

// timer$
//   .pipe(
//     // take(3) // only output 3 values
//     takeUntil(cancelTimer$) // will produce value until cancelTimer$ produce a value
//   )
//   .subscribe(
//     value => (timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`),
//     null,
//     () => {
//       console.log('All Done!');
//     }
//   );

//#endregion

//#region Create your own operator

// function getClassicBooks(year: number, log: boolean) {
//   return (source$: Observable<any>) => {
//     return new Observable(subscriber => {
//       // return keyword make sure to unsubscribe from the source$ Obervable as part of the tear down process to this new Observable
//       return source$.subscribe(
//         book => {
//           if (book['publicationYear'] < year) {
//             // get the book that meets the requirement
//             subscriber.next(book);
//             if (log) {
//               console.log(`CLASSIC: ${book['title']}`);
//             }
//           }
//         },
//         err => {
//           // pass the original error to next operator / subscriber
//           subscriber.error(err);
//         },
//         () => {
//           subscriber.complete();
//         }
//       );
//     });
//   };
// }

// operator with existing operator
// to save code and avoid typo for larger project

// function getClassicBooks1(year) {
//   return filter(book => book['publicationYear'] < 1950);
// }

// function getAndLogClassicBooks(year, log) {
//   return source$ => {
//     source$.pipe(
//       filter(book => book['publicationYear'] < 1950),
//       tap(filteredBooks => (log ? console.log(`CLASSIC: ${filteredBooks['title']}`) : null))
//     );
//   };
// }

// ajax('/api/books')
//   // ajax('/api/errors/500')
//   .pipe(
//     mergeMap(ajaxResponse => ajaxResponse.response),
//     // filter(book => book['publicationYear'] < 1950),
//     // tap(oldBook => console.log(`Title: ${oldBook['title']}`))
//     getClassicBooks(1950, true)
//   )
//   .subscribe(
//     finalValue => console.log(`VALUE: ${finalValue['title']}`),
//     error => console.log(`ERROR: ${error}`)
//   );

//#endregion

//#region Using Subject and Multicasted Observables

// let subject$ = new Subject();

// subject$.subscribe(value => console.log(`Observer 1: ${value}`));

// subject$.subscribe(value => console.log(`Observer 2: ${value}`));

// // since there are 2 obeservers, subject$ will maintain a observer[] list
// subject$.next('Hello!');
// // any value passed through subject$ will be broadcasted to all observers

// let source$ = new Observable(subscriber => {
//   // produces a value
//   subscriber.next('Greetings.');
// });

// // subject$ is the middle poiting between the source$ and the 2 observers
// // subject$ loops through its observer[] list and push the value to all of the observers
// source$.subscribe(subject$);

//#endregion

//#region Cold and Hot Observables

// ----------------------------------------------------------------------------------------------------------------------------cold
// the source$ OB is cold and unicasting values to observer 1, 2, 3
// let source$ = interval(1000).pipe(take(4));

// source$.subscribe(value => console.log(`Observer 1: ${value}`));

// setTimeout(() => {
//   source$.subscribe(value => console.log(`Observer 2: ${value}`));
// }, 1000);

// setTimeout(() => {
//   source$.subscribe(value => console.log(`Observer 3: ${value}`));
// }, 2000);

// ----------------------------------------------------------------------------------------------------------------------------turn to hot
// by putting subject$ between source$ OB and Observers, it turns cold OB to hot OB, the subject$ will push to 3 Observers simultaneously (multicast the value)
// let subject$ = new Subject();
// source$.subscribe(subject$);

// subject$.subscribe(value => console.log(`Observer 1: ${value}`));

// // Observer 2, 3 have some delay, so they will miss some values pushed by subject$
// setTimeout(() => {
//   subject$.subscribe(value => console.log(`Observer 2: ${value}`));
// }, 1000);

// setTimeout(() => {
//   subject$.subscribe(value => console.log(`Observer 3: ${value}`));
// }, 2000);

//#endregion

//#region Built-in Multicasting operator
// ----------------------------------------------------------------------------------------------------------------------------use built-in operator
// let source$: any = interval(1000).pipe(
//   take(4),
//   // multicast(new Subject()),
//   // publish(), // publish() creates a subject$ and manage it internally, it's just a thin wrapper around multicast(), need to remove multicase() when use, late subscribers only receives complete()
//   // publishLast(), // publishLast() wait all values to be produced and make sure only the last value get sent to all observers, late subscriber will receive the value as well
//   // publishBehavior(42), // publishBehavior(seed) emits the seed immediately, then it behaves the same as publish(), late subscribers only receives complete()
//   publishReplay(), // publishReplay() stores and emits multiple values to all observers
//   refCount() // refCount() starts executing when first Observer subscribes, refCount() must be used after publish()/publishLast()
//   // share() // share() allows late subscribers to trigger execution, it internally uses refCount()
// );

// source$.subscribe(value => console.log(`Observer 1: ${value}`));

// setTimeout(() => {
//   source$.subscribe(value => console.log(`Observer 2: ${value}`));
// }, 1000);

// setTimeout(() => {
//   source$.subscribe(value => console.log(`Observer 3: ${value}`));
// }, 2000);

// setTimeout(() => {
//   source$.subscribe(
//     value => console.log(`Observer 4: ${value}`),
//     null,
//     () => console.log(`Observer 4: Complete.`)
//   );
// }, 4500);

// // source$.connect(); // must call connect() to start multicasting, this is an ON-OFF switch, or use refCount

//#endregion

//#region Schedulers: Controlling Execution

// console.log('Start Script');

// let queue$ = of('QueueScheduler (synchronous)', queueScheduler);

// let asap$ = of('AsapScheduler (async micro task)', asapScheduler); // asap$ executes before async$

// let async$ = of('AsyncScheduler (async task)', asyncScheduler); // async$ runs LAST

// merge(queue$, asap$, async$) // merge OBs to a single OB
//   .subscribe(value => console.log(value));

// console.log('End Script');

//#endregion

//#region observeOn Operator

// console.log('Start Script');

// from([1, 2, 3, 4], queueScheduler)
//   .pipe(
//     tap(value => console.log(`Value: ${value}`)),
//     observeOn(asyncScheduler), // this operator passes the OB to the 2nd tap operator, so it will run async-ly, this operator is used for non-blocking tasks
//     tap((value: number) => console.log(`Doubled Value: ${value * 2}`))
//   )
//   .subscribe(); // tap() already handled logging, so no need to call callbacks in subscribe

// console.log('End Script');

//#endregion

// mocha and chai is used by rxjs team for testing

//#region ReplaySubject
// let sub$ = new ReplaySubject();
// let sub$ = new Subject();
// sub$.next(1);
// sub$.next(2);
// sub$.next(3);

// sub$.subscribe(data => {
//   console.log(data);
// });

// sub$.next(4);
// sub$.next(5);

// const A$ = interval(2000);
// const B$ = of(3);
// const C$ = from([5, 6, 7]);

// const D$ = C$.pipe(
//   toArray(),
//   map(arr => arr.reduce((a, b) => a + b), 0)
// );

// const E$ = combineLatest(A$, B$, D$).pipe(
//   take(6),
//   map(arr => arr.reduce((a, b) => a + b), 0)
// );

// E$.subscribe(data => console.log(data));

// const promiseSource$ = from(new Promise(resolve => resolve('data from promise')));

// const sub$ = promiseSource$.subscribe(data => console.log(data));

// const promiseSource$ = from(ajax('api/readers').toPromise());

// const sub$ = promiseSource$.subscribe(data => console.log(data.response));

//#endregion

//#region DebounceTime

// let input = document.getElementById('searchInput');

// let input$ = fromEvent(input, 'keyup').pipe(
//   map(event => event.currentTarget['value']),
//   debounceTime(2000)
// );

// input$.subscribe(value => {
//   displayValue(value);
// });

// function displayValue(value) {
//   let pre = document.createElement('pre');
//   pre.innerHTML = JSON.stringify(value);
//   document.getElementById('results').appendChild(pre);
// }

// let sub$ = new Subject();
// sub$.next('BBB');

// sub$.next('CCC');
// sub$.subscribe(data => console.log(data));
// sub$.next('DDD');

//#endregion

//#region CombineLatest
// When any observable emits a value, emit the last emitted value from each.
// combineLatest will not emit an initial value until each observable emits at least one value.

// starts at 2s, then every 4s
// let timer1$ = timer(2000, 4000);
// let timer2$ = timer(4000, 4000);
// let timer3$ = timer(6000, 4000);

// combineLatest(timer1$, timer2$, timer3$)
//   .pipe(take(9))
//   .subscribe(([timer1, timer2, timer3]) => {
//     console.log(`
//     Timer 1: ${timer1}
//     Timer 2: ${timer2}
//     Timer 3: ${timer3}
//     `);
//   });

//#endregion

//#region ForJoin
// When all observables complete, emit the last emitted value from each.
// similar to Promise.all

// let immediate$ = of('immediate');

// let delay2s$ = of('delay 2s').pipe(delay(2000));

// let mockPromise = data => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(`Promise Resolved: ${data}`);
//     }, 5000);
//   });
// };

// let interval$ = interval(1000).pipe(take(2));

// let interval1$ = interval(1000).pipe(take(4));

// let fromForkJoin$ = forkJoin(immediate$, delay2s$, mockPromise('promise'), interval$, interval1$);

// fromForkJoin$.subscribe(data => console.log(data));
// fromForkJoin$.subscribe(([a, b, c, d, e]) => console.log(c));
//#endregion

//#region Merge
// combine stream concurrently
// let first$ = interval(1000).pipe(mapTo('first'));
// let second$ = interval(1500).pipe(mapTo('second'));
// let third$ = interval(2000).pipe(mapTo('third'));
// let fourth$ = interval(2500).pipe(mapTo('fourth'));

// merge(first$, second$, third$, fourth$)
//   .pipe(take(12))
//   .subscribe(value => {
//     console.log(value);
//   });

// concat
// Subscribe to observables in order as previous completes

concat(of(1, 2, 3), of(4, 5, 6), of(7, 8, 9)).subscribe(data => console.log(data));

// race
// Combining sequences ambiguously. The observable to emit first is used.
let endStream$ = new Subject();
setTimeout(() => {
  endStream$.next('end');
}, 10000);

race(
  interval(1500).pipe(mapTo('1st')),
  interval(1000).pipe(mapTo('Fastest')),
  interval(2000).pipe(mapTo('3rd')),
  interval(2500).pipe(mapTo('4th'))
)
  .pipe(takeUntil(endStream$))
  .subscribe(data => console.log(data));

//#region
