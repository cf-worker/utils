/**
 * Extracts the values of a specified property from an array of objects.
 *
 * @template T - The type of the objects in the array.
 * @template K - The type of the property to extract.
 * @param {T[]} array - The array of objects.
 * @param {K} key - The property to extract from each object.
 * @returns {Array<T[K]>} - An array containing the extracted values.
 */
export function pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]> {
  return array.map((row) => row[key])
}
