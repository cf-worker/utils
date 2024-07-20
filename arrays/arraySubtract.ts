/**
 * Returns a new array containing the elements from array `a` that are not present in array `b`.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} a - The source array.
 * @param {T[]} b - The array to subtract from `a`.
 * @returns {T[]} - A new array containing the elements from `a` that are not present in `b`.
 */
export function arraySubtract<T>(a: T[], b: T[]): T[] {
  return a.filter((value) => !b.includes(value))
}
