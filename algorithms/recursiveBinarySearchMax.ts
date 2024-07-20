/**
 * Find the highest number V between min and max that the predicate returns true.
 *
 * @param min - The minimum value to search from.
 * @param max - The maximum value to search to.
 * @param predicate - The predicate function that determines if a value is true or false.
 * @returns The highest number V between min and max that satisfies the predicate.
 *
 * @example recursiveBinarySearchMax(0, 10, (v) => v < 5) => 4
 * @description only works if predicate returns true for all values from min to V.
 */
export function recursiveBinarySearchMax(min: number, max: number, predicate: (value: number) => boolean): number {
  if (min > max) return max
  const mid = Math.floor((min + max) / 2)
  if (predicate(mid)) {
    return recursiveBinarySearchMax(mid + 1, max, predicate)
  } else {
    return recursiveBinarySearchMax(min, mid - 1, predicate)
  }
}
