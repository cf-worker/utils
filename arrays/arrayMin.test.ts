import { expect, test } from "bun:test"
import { arrayMin } from "./arrayMin.ts"

test("arrayMin", () => {
  expect(arrayMin([3, 1, 2])).toBe(1)
})
