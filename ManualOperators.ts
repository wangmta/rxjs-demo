import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

let source$ = of(1, 2, 3, 4, 5);
let double = map((value: number) => value * 2);
let doubled$ = double(source$);

doubled$.subscribe(value => {
  console.log(value);
});

// an operator is a func that returns a func
// the func takes observable as a parameter and returns an observable

// chain operators
// older code < rxjs 5, not work now

// source$
//   .map(value => value * 2)
//   .filter(mappedValue => mappedValue > 5)
//   .subscribe(finalValue => console.log(finalValue));

// new code > rxjs 5 , use pipe() operator
source$
  .pipe(
    map(value => value * 2),
    filter(mappedValue => mappedValue > 5)
  )
  .subscribe(finalValue => console.log(finalValue));
