/**
 * json/safeJson module.
 * @module
 */
/**
 * Safely parse json without throwing an error,
 * returning undefined if invalid, since undefined is not a valid json
 * @param {string} json
 * @returns {T|undefined} Parsed json as T or undefined if invalid
 */
export function safeJson<T>(json: string): T | undefined {
  try {
    return JSON.parse(json) as T
  } catch {
    return undefined
  }
}
