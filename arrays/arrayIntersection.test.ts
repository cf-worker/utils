import { expect, test } from "bun:test"
import { arrayIntersection } from "./arrayIntersection.ts"

test("arrayIntersection should return the intersection of two arrays", () => {
  const array1 = [1, 2, 3, 4, 5]
  const array2 = [4, 5, 6, 7, 8]
  const expected = [4, 5]
  const result = arrayIntersection(array1, array2)
  expect(result).toEqual(expected)
})
