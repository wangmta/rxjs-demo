// an Obsrevable is not executed until an object subscribes to it
import { Observable, Subscriber } from 'rxjs';
// all these functions can create Observables
import { of, from, concat, fromEvent } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax } from 'rxjs/ajax';

//#region
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

//#region
// multiple observers

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
