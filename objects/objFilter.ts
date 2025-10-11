/**
 * Filter an object by predicate
 * @param obj
 * @param predicate
 * @returns
 */
export function objFilter(
  obj: Record<string, unknown>,
  predicate: (keyValue: [string, unknown]) => boolean,
): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(predicate))
}
