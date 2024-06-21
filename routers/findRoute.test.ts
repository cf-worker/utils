import { assertEquals } from "@std/assert"
import { findRoute } from "./findRoute.ts"
import { GET, POST } from "./verbs.ts"

const routes = new Map([
  [GET("/"), "root"],
  [POST("/users/:id"), "users"],
])

Deno.test("GET /", () => {
  const req = new Request("data:///")
  const params = {}
  const result = findRoute(routes, req, params)
  assertEquals(result, "root")
  assertEquals(params, {})
})

Deno.test("POST /users/123", () => {
  const req = new Request("data:///users/123", { method: "POST" })
  const params = {}
  const result = findRoute(routes, req, params)
  assertEquals(result, "users")
  assertEquals(params, { id: "123" })
})

Deno.test("DELETE /users/123", () => {
  const req = new Request("data:///users/123", { method: "DELETE" })
  const params = {}
  const result = findRoute(routes, req, params)
  assertEquals(result, undefined)
  assertEquals(params, {})
})
