import { expect, test } from "bun:test"
import { arrayDuplicates } from "./arrayDuplicates.ts"

test("arrayDuplicates should return an array of duplicate elements", () => {
  const input = [1, 2, 3, 2, 4, 3, 5, 5]
  const expectedOutput = [2, 3, 5]
  const result = arrayDuplicates(input)
  expect(result).toEqual(expectedOutput)
})
