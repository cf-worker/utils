import { expect, test } from "bun:test"
import { arrayBalanced } from "./arrayBalanced.ts"

test("arrayBalanced", () => {
  // starting with max 64 bits, you can have 65 balances until colision
  let prev = 0n
  let current = 2n ** 64n - 1n
  let count = 0
  while (prev !== current) {
    count++
    prev = current
    current = current / 2n
  }
  expect(count).toBe(65)
  expect(arrayBalanced(1)).toEqual([(2n ** 64n - 1n) / 2n])
  expect(arrayBalanced(2)).toEqual([6148914691236517205n, 12297829382473034410n])
  expect(arrayBalanced(1, 1n)).toEqual([1n])
  expect(arrayBalanced(1, 2n)).toEqual([1n])
  expect(arrayBalanced(2, 3n)).toEqual([1n, 2n])
  expect(arrayBalanced(3, 4n)).toEqual([1n, 2n, 3n])
  expect(arrayBalanced(4, 5n)).toEqual([1n, 2n, 3n, 4n])
  expect(arrayBalanced(2, 10n)).toEqual([3n, 6n])
  expect(arrayBalanced(3, 10n)).toEqual([2n, 4n, 6n])
  expect(arrayBalanced(4, 10n)).toEqual([2n, 4n, 6n, 8n])
  expect(arrayBalanced(5, 10n)).toEqual([1n, 2n, 3n, 4n, 5n])
  expect(arrayBalanced(6, 10n)).toEqual([1n, 2n, 3n, 4n, 5n, 6n])
  expect(arrayBalanced(9, 10n)).toEqual([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n])
  expect(arrayBalanced(10, 10n)).toEqual([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n])

  expect(arrayBalanced(1, 100n)).toEqual([50n])
  expect(arrayBalanced(2, 100n)).toEqual([33n, 66n])
  expect(arrayBalanced(3, 100n)).toEqual([25n, 50n, 75n])
  expect(arrayBalanced(4, 100n)).toEqual([20n, 40n, 60n, 80n])
  expect(arrayBalanced(9, 100n)).toEqual([10n, 20n, 30n, 40n, 50n, 60n, 70n, 80n, 90n])
})
