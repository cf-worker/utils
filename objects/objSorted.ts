/**
 * Return the object with the keys sorted
 * @param obj
 * @returns
 */
export function objSorted(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).toSorted(([a], [b]) => a.localeCompare(b)))
}
