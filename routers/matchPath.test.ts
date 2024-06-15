import { assertEquals } from "@std/assert"
import { matchPath } from "./matchPath.ts"

Deno.test("matchPath success", () => {
  assertEquals(matchPath("/users/:id", "/users/123")?.id, "123")
})

Deno.test("matchPath fail returns undefined", () => {
  assertEquals(matchPath("/users/:id", "/users"), undefined)
})
