import { expect, test } from "bun:test"
import { arrayMax } from "./arrayMax.ts"

test("arrayMax", () => {
  expect(arrayMax([1, 3, 2])).toBe(3)
})
