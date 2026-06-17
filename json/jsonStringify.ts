/** Safely stringify a value, falling back to a JSON stringified error message if needed. */
export function jsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch (e) {
    return JSON.stringify(e instanceof Error ? e.message : String(e))
  }
}
