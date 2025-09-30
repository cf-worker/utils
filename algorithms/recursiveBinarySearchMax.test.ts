import { expect, test } from "bun:test"
import { recursiveBinarySearchMax } from "./recursiveBinarySearchMax.ts"

test("recursiveBinarySearchMax from 0 to 100", () => {
  const min = 0
  const max = 100
  for (let i = min; i <= max; i++) {
    expect(recursiveBinarySearchMax(min, max, (v) => v <= i)).toEqual(i)
  }
})

test("recursiveBinarySearchMax should return lower than min if not found", () => {
  const min = 5
  const max = 10
  expect(recursiveBinarySearchMax(min, max, (v) => v > max)).toEqual(4)
})
