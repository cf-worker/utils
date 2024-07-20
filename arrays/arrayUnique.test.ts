import { expect, test } from "bun:test"
import { arrayUnique } from "./arrayUnique.ts"

test("arrayUnique should return a new array with unique elements", () => {
  const input = [1, 2, 2, 3, 4, 4, 5]
  const expectedOutput = [1, 2, 3, 4, 5]
  const result = arrayUnique(input)
  expect(result).toEqual(expectedOutput)
})
