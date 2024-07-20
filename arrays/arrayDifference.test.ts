import { expect, test } from "bun:test"
import { arrayDifference } from "./arrayDifference.ts"

test("arrayDifference should return the difference between two arrays", () => {
  const array1 = [1, 2, 3, 4, 5]
  const array2 = [3, 4, 5, 6, 7]
  const expected = [1, 2]

  const result = arrayDifference(array1, array2)

  expect(result).toEqual(expected)
})
