import { expect, test } from "bun:test"
import { matcherPath } from "./matcherPath.ts"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

if (typeof globalThis.URLPattern === "undefined") {
  // @ts-expect-error: URLPatternPolyfill
  globalThis.URLPattern = URLPatternPolyfill
}

const match = matcherPath("/users/:id")

test("matcherPath should return undefined for non-matching paths", () => {
  expect(match("/posts/123")).toBeUndefined()
})

test("matcherPath should return an object with matched parameters for matching paths", () => {
  expect(match("/users/123")).toEqual({ id: "123" })
})
