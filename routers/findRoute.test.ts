import { expect, test } from "bun:test"
import "./installURLPatternPolyfill.bun.ts"
import { findRoute } from "./findRoute.ts"
import { GET, POST } from "./verbs.ts"

const routes = new Map([
  [GET("/"), "root"],
  [POST("/users/:id"), "users"],
])

test("GET /", () => {
  const req = new Request("data:///")
  const params = {}
  const result = findRoute(routes, req, params)
  expect(result).toBe("root")
  expect(params).toEqual({})
})

test("POST /users/123", () => {
  const req = new Request("data:///users/123", { method: "POST" })
  const params = {}
  const result = findRoute(routes, req, params)
  expect(result).toBe("users")
  expect(params).toEqual({ id: "123" })
})

test("DELETE /users/123", () => {
  const req = new Request("data:///users/123", { method: "DELETE" })
  const params = {}
  const result = findRoute(routes, req, params)
  expect(result).toBeUndefined()
  expect(params).toEqual({})
})
