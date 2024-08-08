/**
 * Parse json with better error message containing the invalid json
 * @param {string} json representing the json to parse
 * @returns {unknown} parsed json
 * @throws {Error} with invalid json for inspection
 */
export function tryJson<T>(json: string): T {
  try {
    return JSON.parse(json) as T
  } catch (error) { // SyntaxError
    throw new Error(`${error.name}, ${error.message}:\n${json}`)
  }
}
