import { assertEquals } from "@std/assert"
import { matchPath } from "./matchPath.ts"

Deno.test("matchPath success", () => {
  const pattern = "/users/:id"
  const pathname = "/users/123"
  const expected = { id: "123" }
  const actual = matchPath<"id">(pattern, pathname)
  assertEquals(actual, expected)
})

Deno.test("matchPath fail returns undefined", () => {
  const pattern = "/users/:id"
  const pathname = "/users"
  const expected = undefined
  const actual = matchPath(pattern, pathname)

  assertEquals(actual, expected)
})
