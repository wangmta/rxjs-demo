// operator is a function that returns an other function which take an OB as parameter, and returns an new OB
let newObservable$;

function myOperator(config1, config2) {
  return function(source$) {
    return newObservable$;
  };
}

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
let source$ = of(1, 2, 3, 4, 5);

function doublerOperator() {
  return map((value: number) => value * 2);
}

source$.pipe(doublerOperator()).subscribe(doubledValue => console.log(doubledValue));
