import { Observable, ReplaySubject, from, Subject } from 'rxjs';
import { scan, zip, startWith } from 'rxjs/operators';

const book = 'this is a book, which will be recited';

const person1$ = new ReplaySubject(Number.MAX_VALUE);
const person2$ = new ReplaySubject(3);

const readBook$ = from(book.split(''));

let subscription1 = readBook$.subscribe(person1$);
let subscription2 = readBook$.subscribe(person2$);

// console.log(subscription1);
// console.log(subscription2);
// console.log(subscription1['destination']['_events']);
