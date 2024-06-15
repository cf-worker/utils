import { assertEquals } from "@std/assert"
import { matcherPath } from "./matcherPath.ts"

const match = matcherPath("/users/:id")

Deno.test("matcherPath should return undefined for non-matching paths", () => {
  assertEquals(match("/posts/123"), undefined)
})

Deno.test("matcherPath should return an object with matched parameters for matching paths", () => {
  assertEquals(match("/users/123"), { id: "123" })
})
