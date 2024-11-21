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
    throw new SyntaxError(
      `${(error as SyntaxError).name}, ${(error as SyntaxError).message}:\n${json}`,
      { cause: json },
    )
  }
}
