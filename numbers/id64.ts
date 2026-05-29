/**
 * numbers/id64 module.
 * @module
 */
declare const id64MaskBrand: unique symbol

export type Id64Mask = bigint & { readonly [id64MaskBrand]: true }

export type Id64Config = {
  lastId64: bigint
  mask: bigint
}

// Custom Unix epoch in microseconds. Matches unix_timestamp(...) - 1100000000 from the SQL formula.
const OFFSET_US = 1_100_000_000_000_000n
// Number of IDs available per microsecond. 16_384 is 2^14, matching the SQL << 14 shift.
const MULTIPLIER = 16_384n

// MySQL equivalent of id64(): microsecond Unix timestamp minus OFFSET_US, shifted by 14 suffix bits,
// then OR-ed with the lower 14 bits from uuid_short().
export const MYSQL_FORMULA =
  "((unix_timestamp(now(6)) * 1000000 - 1100000000000000) << 14) | (uuid_short() & 16383)"

// PostgreSQL equivalent of id64() using a sequence for a coordinated 14-bit suffix.
// Create the sequence before using the formula: CREATE SEQUENCE id64_seq;
export const POSTGRES_FORMULA =
  "(((extract(epoch from clock_timestamp()) * 1000000)::bigint - 1100000000000000) << 14) | (nextval('id64_seq') & 16383)"

export const cfg: Id64Config = {
  // Last emitted ID, used as a monotonic counter when multiple calls resolve to the same timestamp.
  lastId64: 0n,
  // Already aligned 14-bit suffix mask. Use cfg.mask = 0b10100000000000n to mark leftmost bits as 0b101.
  get mask(): Id64Mask {
    return mask
  },
  set mask(nextMask: bigint) {
    mask = id64Mask(nextMask)
  },
}

let mask = id64Mask(0n)

/**
 * Validates a 14-bit suffix mask before assigning it to cfg.mask.
 *
 * The mask must already be aligned to the suffix format. For example, to mark an
 * instance as 0b101 in the leftmost suffix bits, use cfg.mask = 0b10100000000000n.
 *
 * @param mask
 * @returns
 */
export function id64Mask(mask: bigint): Id64Mask {
  if (mask < 0n || mask >= MULTIPLIER) {
    throw new RangeError("id64 mask must be a 14-bit suffix mask")
  }

  return mask as Id64Mask
}

/**
 * id64: Universally Unique Lexicographically Sortable Identifier
 * 64 bits unsigned integer, max =
 * 20 digits, timestamp microseconds + 14-bit suffix
 * 18446744073709551615n = Max Unsigned Int 64 bits
 *
 * Supported boundary values:
 * - min ID 10000000000000000000, at now 1710351562500 ms, 2024-03-13T17:39:22.500Z
 * - max ID 18446744073709551615, at now 2225899906842 ms, 2040-07-14T17:31:46.842Z
 * Values outside this `now` range are not rejected.
 *
 * Binary layout:
 * - 64 bits total: [50-bit timestamp delta in microseconds][14-bit counter suffix]
 * - cfg.mask is an already aligned 14-bit suffix mask.
 * - To mark an instance as 0b101 in the leftmost suffix bits, set cfg.mask = 0b10100000000000n.
 * - The mask must be between 0b00000000000000n and 0b11111111111111n.
 *
 * @param now
 * @returns
 */
export function id64(now: number = performance.timeOrigin + performance.now()): string {
  const currentTimestamp = BigInt(Math.trunc(now * 1000))
  const base = (currentTimestamp - OFFSET_US) * MULTIPLIER
  let current = base | cfg.mask
  if (current <= cfg.lastId64) current = cfg.lastId64 + 1n
  cfg.lastId64 = current
  return current.toString()
}

/**
 * Extract the timestamp from a id64 string
 * @param id64
 * @returns
 */
export function id64ts(id64: string): number {
  return Number((BigInt(id64) / MULTIPLIER + OFFSET_US) / 1000n)
}
