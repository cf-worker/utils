import { expect, test } from "bun:test"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"
import { DELETE, GET, PATCH, POST, PUT, QUERY } from "./verbs.ts"

if (typeof globalThis.URLPattern === "undefined") {
  // @ts-expect-error: URLPatternPolyfill
  globalThis.URLPattern = URLPatternPolyfill
}

test("GET success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "GET", url: "/users/123" }
  const matcher = GET(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("GET fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "GET", url: "/users" }
  const matcher = GET(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})

test("POST success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "POST", url: "/users/123" }
  const matcher = POST(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("POST fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "POST", url: "/users" }
  const matcher = POST(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})

test("PUT success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PUT", url: "/users/123" }
  const matcher = PUT(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("PUT fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PUT", url: "/users" }
  const matcher = PUT(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})

test("PATCH success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PATCH", url: "/users/123" }
  const matcher = PATCH(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("PATCH fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "PATCH", url: "/users" }
  const matcher = PATCH(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})

test("DELETE success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "DELETE", url: "/users/123" }
  const matcher = DELETE(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("DELETE fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "DELETE", url: "/users" }
  const matcher = DELETE(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})

test("QUERY success", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "QUERY", url: "/users/123" }
  const matcher = QUERY(pattern)
  const result = matcher(methodUrl)
  expect(result).toEqual({ id: "123" })
})

test("QUERY fail", () => {
  const pattern = "/users/:id"
  const methodUrl = { method: "QUERY", url: "/users" }
  const matcher = QUERY(pattern)
  const result = matcher(methodUrl)
  expect(result).toBeUndefined()
})
