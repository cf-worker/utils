import { expect, test } from "bun:test"
import { matchPath } from "./matchPath.ts"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

if (typeof globalThis.URLPattern === "undefined") {
  // @ts-expect-error: URLPatternPolyfill
  globalThis.URLPattern = URLPatternPolyfill
}

test("matchPath success", () => {
  expect(matchPath("/users/:id", "/users/123")?.id).toBe("123")
})

test("matchPath fail returns undefined", () => {
  expect(matchPath("/users/:id", "/users")).toBeUndefined()
})
