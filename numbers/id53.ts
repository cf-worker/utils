/**
 * numbers/id53 module.
 * @module
 */

let lastId53 = 0

/**
 * Generates a unique 53-bit safe integer identifier.
 *
 * The ID is timestamp-based using milliseconds since time origin,
 * ensuring lexicographic sorting order. It has always 16 characters
 * length (up to Number.MAX_SAFE_INTEGER = 9007199254740991).
 *
 * The function guarantees uniqueness within a single thread/process
 * by maintaining an internal counter. If the current timestamp is
 * less than or equal to the last generated ID, it increments the
 * previous value instead.
 *
 * @returns A unique 53-bit safe integer (max 16 digits)
 *
 * @example
 * ```ts
 * const id = id53()
 * console.log(id) // 1717145600000000 (example)
 * console.log(String(id).length) // 16
 * ```
 *
 * @remarks
 * - **Thread safety**: Only safe for single-thread/single-process servers
 * - **Not for client-side**: Two different clients can generate the same ID
 * - **Collision-free**: Internal counter prevents duplicates within same process
 * - **Sortable**: IDs are naturally ordered by creation time
 */
export function id53() {
  let ts = Math.trunc((performance.timeOrigin + performance.now()) * 1000)
  if (ts <= lastId53) ts = lastId53 + 1
  lastId53 = ts

  return ts
}

/**
 * Extracts the Unix timestamp (in seconds) from a id53 identifier.
 *
 * @param id53 - The 53-bit safe integer identifier to extract timestamp from
 * @returns The Unix timestamp in seconds (truncated, not rounded)
 *
 * @example
 * ```ts
 * const id = id53()
 * const timestamp = id53ts(id)
 * console.log(new Date(timestamp * 1000)) // Date object
 * ```
 */
export function id53ts(id53: number): number {
  return Math.trunc(id53 / 1000)
}
