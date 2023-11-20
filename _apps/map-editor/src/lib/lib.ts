/**
 * Send value to function that optionally transforms it.
 *
 * Useful for using the result of a function call multiple times without
 * needing to define a temporary variable. There are specific use cases where
 * this operation is desirable. If you don't know what those use cases are,
 * then you probably don't need this functionality.
 *
 * View `lib.example.ts` for example code.
 *
 * @export
 * @template TValue
 * @template TResult
 * @param {TValue} value
 * @param {(value: TValue) => TResult} fn
 * @returns {TResult}
 */
export function $<TValue, TResult>(value: TValue, fn: (value: TValue) => TResult): TResult {
  return fn(value);
}

/**
 * Send value if not undefined and not null to function. Otherwise, do nothing.
 *
 * Useful for narrowing value types and using within a function.
 *
 * View `lib.example.ts` for example code.
 *
 * @export
 * @template TValue
 * @param {(TValue | null | undefined)} value
 * @param {(value: TValue) => void} fn
 * @returns {void) => void}
 */
export function $use<TValue>(value: TValue | null | undefined, fn: (value: TValue) => void): void {
  if (value !== null && value !== undefined) fn(value);
}

/**
 * Type narrowing for values that could be undefined or null.
 *
 * @export
 * @template TValue
 * @param {(TValue | null | undefined)} [value]
 * @returns {value is TValue}
 */
export function $exists<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
