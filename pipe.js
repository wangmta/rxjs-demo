"use strict";
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var nums = rxjs_1.of(1, 2, 3, 4, 5);
// Create a function that accepts an Observable.
var squareOddVals = rxjs_1.pipe(operators_1.filter(function (n) { return n % 2 !== 0; }), operators_1.map(function (n) { return n * n; }));
// Create an Observable that will run the filter and map functions
var squareOdd = squareOddVals(nums);
// Subscribe to run the combined functions
squareOdd.subscribe(function (x) { return console.log(x); });
