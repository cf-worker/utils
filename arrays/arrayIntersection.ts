export function arrayIntersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((elem) => array2.includes(elem))
}
