import { $, $use } from './lib.js';

/**
 * $
 */

function expensiveCall(data: { a: number; b: number; c: number }) {
  for (let i = 0; i < data.a; ++i) {}
  for (let i = 0; i < data.b; ++i) {}
  for (let i = 0; i < data.c; ++i) {}
  return 0;
}

// Running an expensive call multiple times is not ideal.
console.log(
  `The square of ${expensiveCall({ a: 1, b: 234, c: 5678 })} is`,
  expensiveCall({ a: 1, b: 234, c: 5678 }) * expensiveCall({ a: 1, b: 234, c: 5678 }),
);

// Typically, the result would be stored in a temporary variable, first.
// This method is fine but can leave the source code cluttered, especially if
// multiple expensive calls happen.
const result = expensiveCall({ a: 1, b: 234, c: 5678 });
const squared = result * result;
console.log(`The square of ${result} is`, squared);

// $() allows for the following:
$(expensiveCall({ a: 1, b: 234, c: 5678 }), (n) => console.log(`The square of ${n} is`, n * n));

/**
 * $use
 */

$use(null, (v) => console.log(v)); // nothing happens
$use(undefined, (v) => console.log(v)); // nothing happens
$use(0, (v) => console.log(v)); // prints '0' to console
