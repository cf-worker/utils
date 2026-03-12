import { expect, test } from "bun:test"
import "./installURLPatternPolyfill.bun.ts"
import { matcherPath } from "./matcherPath.ts"

const match = matcherPath("/users/:id")

test("matcherPath should return undefined for non-matching paths", () => {
  expect(match("/posts/123")).toBeUndefined()
})

test("matcherPath should return an object with matched parameters for matching paths", () => {
  expect(match("/users/123")).toEqual({ id: "123" })
})
