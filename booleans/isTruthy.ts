/**
 * booleans/isTruthy module.
 * @module
 */
/**
 * Check if a value is likely true
 * @param val
 * @returns
 */
export function isTruthy(val: unknown): boolean {
  if (!val) return false // false null undefined "" 0
  if (Array.isArray(val)) return true
  val = String(val).trim().toLowerCase()
  switch (val) {
    // case "":
    // case "0":
    case "f":
    case "false":
    case "n":
    case "no":
    case "off":
    case "null":
    case "undefined":
      return false
  }
  return true
}
