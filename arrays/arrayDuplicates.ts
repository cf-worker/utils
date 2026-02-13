/**
 * arrays/arrayDuplicates module.
 * @module
 */
/**
 * Return duplicated elements from an array.
 */
export function arrayDuplicates<T>(array: T[]): T[] {
  return array.filter((elem, index) => array.indexOf(elem) !== index)
}
