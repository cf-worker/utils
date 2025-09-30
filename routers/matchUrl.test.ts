import { expect, test } from "bun:test"
import { matchUrl } from "./matchUrl.ts"

test("matchUrl success", () => {
  expect(matchUrl("/users/:id", "http://localhost/users/123")?.id).toBe("123")
})

test("matchUrl accepts pathname", () => {
  expect(matchUrl("/users/:id", "/users/123")?.id).toEqual("123")
})

test("matchUrl fail returns undefined", () => {
  expect(matchUrl("/users/:id", "http://localhost/users")).toBeUndefined()
})
