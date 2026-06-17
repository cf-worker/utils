/**
 * json/safeJson module.
 * @module
 */
/**
 * Safely parse json without throwing an error,
 * returning undefined if invalid, since undefined is not a valid json
 * @param {string | null | undefined} json
 * @returns {T|undefined} Parsed json as T or undefined if invalid
 */
export function safeJson<T>(json: string | null | undefined): T | null | undefined {
  if (json === null || json === undefined) return json
  try {
    return JSON.parse(json) as T
  } catch {
    return undefined
  }
}
