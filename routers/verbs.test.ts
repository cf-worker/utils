import { assertEquals } from "@std/assert"
import { DELETE, GET, PATCH, POST, PUT, QUERY } from "./verbs.ts"

Deno.test("GET success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "GET", url: "/users/123" }
  const matcher = GET(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("GET fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "GET", url: "/users" }
  const matcher = GET(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})

Deno.test("POST success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "POST", url: "/users/123" }
  const matcher = POST(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("POST fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "POST", url: "/users" }
  const matcher = POST(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})

Deno.test("PUT success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PUT", url: "/users/123" }
  const matcher = PUT(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("PUT fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PUT", url: "/users" }
  const matcher = PUT(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})

Deno.test("PATCH success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PATCH", url: "/users/123" }
  const matcher = PATCH(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("PATCH fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PATCH", url: "/users" }
  const matcher = PATCH(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})

Deno.test("DELETE success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "DELETE", url: "/users/123" }
  const matcher = DELETE(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("DELETE fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "DELETE", url: "/users" }
  const matcher = DELETE(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})

Deno.test("QUERY success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "QUERY", url: "/users/123" }
  const matcher = QUERY(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, { id: "123" })
})

Deno.test("QUERY fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "QUERY", url: "/users" }
  const matcher = QUERY(pattern)
  const result = matcher(methodUrl)
  assertEquals(result, undefined)
})
