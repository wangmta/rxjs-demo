// an Obsrevable is not executed until an object subscribes to it
import { Observable, Subscriber, throwError } from 'rxjs';
// all these functions can create Observables
import { of, from, concat, fromEvent } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax } from 'rxjs/ajax';
import { mergeMap, filter, tap, catchError, take, takeUntil } from 'rxjs/operators';

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

//#region
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

//#region multiple observers

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
ajax('/api/books')
  // ajax('/api/errors/500')
  .pipe(
    mergeMap(ajaxResponse => ajaxResponse.response),
    filter(book => book['publicationYear'] < 1950),
    tap(oldBook => console.log(`Title: ${oldBook['title']}`)),
    // catchError(err => of({ title: 'MyBook', author: 'Me' })), // option 1: this obj will be treated as finalValue and replace previous value, it will not be passed to error
    // catchError((err, caught) => caught) // option 2: caught is the OB that produce the error, this code will cause retry
    // catchError(err => {
    //   throw `Error happens - ${err.message}`;
    //   // option 3: this error will be catched by error object
    // })
    catchError(err => {
      return throwError(err.message);
    }) // option 4: this is similar to option 3, but this returns an OB
  )
  .subscribe(
    finalValue => console.log(`VALUE: ${finalValue['title']}`),
    error => console.log(`ERROR: ${error}`)
  );

// catchError can catch error from the above operators and returns a OB

//#endregion

//#region take, takeUntil, cancel subscription

let timesDiv = document.getElementById('times');
let button = document.getElementById('timerButton');

let timer$ = new Observable(subscriber => {
  let i = 0;
  let intervalID = setInterval(() => {
    subscriber.next(i++);
  }, 1000);
  return () => {
    console.log('Executing teardown code.');
    clearInterval(intervalID);
  };
});

let cancelTimer$ = fromEvent(button, 'click'); // it will produce a value when button is clicked

timer$
  .pipe(
    // take(3) // only output 3 values
    takeUntil(cancelTimer$) // will produce value until cancelTimer$ produce a value
  )
  .subscribe(
    value => (timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`),
    null,
    () => {
      console.log('All Done!');
    }
  );

//#endregion
