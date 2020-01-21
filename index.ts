// an Obsrevable is not executed until an object subscribes to it
import { Observable, Subscriber, throwError, Subject, interval, ConnectableObservable } from 'rxjs';
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
  share
} from 'rxjs/operators';

//#region Observerables fundamentals
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

// ----------------------------------------------------------------------------------------------------------------------------use built-in operator
let source$: any = interval(1000).pipe(
  take(4),
  // multicast(new Subject()),
  // publish(), // publish() creates a subject$ and manage it internally, it's just a thin wrapper around multicast(), need to remove multicase() when use, late subscribers only receives complete()
  // refCount(), // refCount() starts executing when first Observer subscribes
  share() // share() allows late subscribers to trigger execution, it internally uses refCount()
);

source$.subscribe(value => console.log(`Observer 1: ${value}`));

setTimeout(() => {
  source$.subscribe(value => console.log(`Observer 2: ${value}`));
}, 1000);

setTimeout(() => {
  source$.subscribe(value => console.log(`Observer 3: ${value}`));
}, 2000);

setTimeout(() => {
  source$.subscribe(
    value => console.log(`Observer 4: ${value}`),
    null,
    () => console.log(`Observer 4: Complete.`)
  );
}, 4500);

// source$.connect(); // must call connect() to start multicasting, this is an ON-OFF switch, or use refCount

//#endregion
