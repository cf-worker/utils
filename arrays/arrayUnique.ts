/**
 * Returns a new array with unique elements from the input array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The input array.
 * @returns {T[]} - A new array with unique elements.
 */
export function arrayUnique<T>(arr: T[]): T[] {
  return arr.filter((elem, index) => arr.indexOf(elem) === index)
}
