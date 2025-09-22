const MAX = 2n ** 64n - 1n

/**
 * Returns an numeric array with numbers equaly distributed,
 * used for sorting lists in the database.
 * @param length size of the returned array
 * @param max bigint
 * @returns bigint[]
 */
export function arrayBalanced(length: number, max = MAX): bigint[] {
  return Array(length)
    .fill(max > length ? max / (BigInt(length) + 1n) : 1n)
    .map((n: bigint, i: number) => n * BigInt(i + 1))
}
