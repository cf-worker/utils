import { assertEquals } from "@std/assert"
import { matchUrl } from "./matchUrl.ts"

Deno.test("matchUrl success", () => {
  assertEquals(matchUrl("/users/:id", "http://localhost/users/123")?.id, "123")
})

Deno.test("matchUrl accepts pathname", () => {
  assertEquals(matchUrl("/users/:id", "/users/123")?.id, "123")
})

Deno.test("matchUrl fail returns undefined", () => {
  assertEquals(matchUrl("/users/:id", "http://localhost/users"), undefined)
})
