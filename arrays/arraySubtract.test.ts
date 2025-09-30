import { expect, test } from "bun:test"
import { arraySubtract } from "./arraySubtract.ts"

test("arraySubtract should return a new array with elements from 'a' that are not present in 'b'", () => {
  const a = [1, 2, 3, 4, 5]
  const b = [3, 4, 5, 6, 7]
  const result = arraySubtract(a, b)
  expect(result).toEqual([1, 2])
})

test("arraySubtract should return an empty array when 'a' is empty", () => {
  const a: number[] = []
  const b = [1, 2, 3]
  const result = arraySubtract(a, b)
  expect(result).toEqual([])
})

test("arraySubtract should return 'a' when 'b' is empty", () => {
  const a = [1, 2, 3]
  const b: number[] = []
  const result = arraySubtract(a, b)
  expect(result).toEqual([1, 2, 3])
})

test("arraySubtract should return an empty array when both 'a' and 'b' are empty", () => {
  const a: number[] = []
  const b: number[] = []
  const result = arraySubtract(a, b)
  expect(result).toEqual([])
})
