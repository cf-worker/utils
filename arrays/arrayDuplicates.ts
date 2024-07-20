export function arrayDuplicates<T>(array: T[]): T[] {
  return array.filter((elem, index) => array.indexOf(elem) !== index)
}
