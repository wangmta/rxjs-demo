import { of, Observable, Subscriber } from 'rxjs';
let myObserver = {
  next: value => console.log(value),
  error: err => console.log(err),
  complete: () => console.log('all done producing values')
};

let sourceObservable$ = of(1, 3, 5);
sourceObservable$.subscribe(myObserver);

// in an Observable, an Observer is passed in as a parameter by default
// value, error and complete is optional, all functions are optional
let sourceObservable1$ = of(2, 4, 6);
sourceObservable1$.subscribe(
  value => console.log(value),
  err => console.log(err),
  () => console.log('all done producing values')
);

// or user a subscriber
// subscriber implements the Observer interface
let myNumbers = [1, 3, 5];
let numberObservable$ = new Observable(subscriber => {
  if (myNumbers.length === 0) subscriber.error('No Values.');

  for (let num of myNumbers) {
    subscriber.next(num);
  }

  subscriber.complete();
});

numberObservable$.subscribe(myObserver);
