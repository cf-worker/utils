/**
 * json/headers2json module.
 * @module
 */
/**
 * Makes it possible to JSON.stringify Headers
 * @param headers Headers
 * @returns Record<string, string>
 */
export function headers2json(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers)
}
