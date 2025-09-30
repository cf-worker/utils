import { expect, test } from "bun:test"
import { arrayNaturalSorter } from "./arrayNaturalSorter.ts"

test("arrayNaturalSorter", () => {
  const array = ["1", "10", "11", "2", "3"]
  const expected = ["1", "2", "3", "10", "11"]
  const result = arrayNaturalSorter(array)
  expect(result).toEqual(expected)
})
