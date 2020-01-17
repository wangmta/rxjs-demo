import { filter, map } from 'rxjs/operators';
import { of, pipe } from 'rxjs';

const nums = of(1, 2, 3, 4, 5);

// Create a function that accepts an Observable.
const squareOddVals = pipe(
  filter((n: number) => n % 2 !== 0),
  map(n => n * n)
);

// Create an Observable that will run the filter and map functions
const squareOdd = squareOddVals(nums);

// Subscribe to run the combined functions
squareOdd.subscribe(x => console.log(x));

const squareOdd1 = of(1, 2, 3, 4, 5).pipe(
  filter(n => n % 2 !== 0),
  map(n => n * n)
);

// Subscribe to get values
squareOdd1.subscribe(x => console.log(x));
