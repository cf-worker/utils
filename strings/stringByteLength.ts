/**
 * strings/stringByteLength module.
 * @module
 */
/**
 * Calculates the byte length of a string.
 *
 * @param str - The string to calculate the byte length for.
 * @returns The byte length of the string.
 */
export function stringByteLength(str: string): number {
  return new TextEncoder().encode(str).length
}
