import { expect, test } from "bun:test"
import { arrayGroupCount } from "./arrayGroupCount.ts"

test("arrayGroupCount", () => {
  const array = [1, 2, 1, 4, 2]
  const expected = { 1: 2, 2: 2, 4: 1 }
  const result = arrayGroupCount(array)
  expect(Object.fromEntries(result)).toEqual(expected)
})
