/**
 * arrays/arrayNaturalSorter module.
 * @module
 */
/**
 * Sort 1, 2, 3, 10, 11 instead of 1, 10, 11, 2, 3
 * @param array
 * @returns
 */
export function arrayNaturalSorter<T>(array: T[]): T[] {
  return array.toSorted((a: T, b: T) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  )
}
