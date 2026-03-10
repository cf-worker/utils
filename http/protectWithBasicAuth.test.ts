import { expect, test } from "bun:test"
import { protectWithBasicAuth } from "./protectWithBasicAuth.ts"

function createRequestWithAuthorization(authorization?: string) {
  return new Request("https://example.com", {
    headers: authorization ? { authorization } : undefined,
  })
}

test("protectWithBasicAuth returns 404 when authorization header is missing", async () => {
  const response = protectWithBasicAuth(createRequestWithAuthorization(), "admin", "secret")

  expect(response?.status).toBe(404)
  expect(await response?.text()).toBe("Not Found")
})

test("protectWithBasicAuth returns 404 for non-basic authorization", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization("Bearer token"),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(404)
})

test("protectWithBasicAuth returns 404 for malformed basic authorization", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization("Basic invalid-base64%%%"),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(404)
})

test("protectWithBasicAuth returns 404 for wrong credentials", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization(`Basic ${btoa("admin:wrong")}`),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(404)
})

test("protectWithBasicAuth returns null for matching credentials", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization(`Basic ${btoa("admin:secret")}`),
    "admin",
    "secret",
  )

  expect(response).toBeNull()
})
