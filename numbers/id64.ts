/**
 * numbers/id64 module.
 * @module
 */
let lastId64 = 0n
//            17603085528865971680n
const TIMESTAMP_OFFSET = 7600000000000000000n
/**
 * ulid: Universally Unique Lexicographically Sortable Identifier
 * 64 bits unsigned integer, max =
 * 20 digits, 13 timestamp miliseconds + 7 microseconds
 * 18446744073709551615n = Max Unsigned Int 64 bits
 * @param now
 * @returns
 */
export function id64(now: number = performance.timeOrigin + performance.now()): string {
  let current = BigInt(now.toFixed(7).replace(".", "")) - TIMESTAMP_OFFSET
  if (current <= lastId64) current = lastId64 + 1n
  lastId64 = current
  return current.toString()
}

/**
 * Extract the timestamp from a id64 string
 * @param id64
 * @returns
 */
export function id64ts(id64: string): number {
  return +(BigInt(id64) + TIMESTAMP_OFFSET).toString().substring(0, 13)
}
