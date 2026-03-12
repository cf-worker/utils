import { expect, test } from "bun:test"
import "./installURLPatternPolyfill.bun.ts"
import { matchPath } from "./matchPath.ts"

test("matchPath success", () => {
  expect(matchPath("/users/:id", "/users/123")?.id).toBe("123")
})

test("matchPath fail returns undefined", () => {
  expect(matchPath("/users/:id", "/users")).toBeUndefined()
})
