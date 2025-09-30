/**
 * Group array elements and count ocurrencies
 * @param list
 * @returns
 */
export function arrayGroupCount<T>(
  list: T[],
): Map<T, number> {
  return list.reduce(
    (acc, key) => acc.set(key, (acc.get(key) ?? 0) + 1),
    new Map<T, number>(),
  )
}
