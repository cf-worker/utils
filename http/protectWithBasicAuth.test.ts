import { expect, test } from "bun:test"
import { protectWithBasicAuth } from "./protectWithBasicAuth.ts"

function createRequestWithAuthorization(authorization?: string) {
  return new Request("https://example.com", {
    headers: authorization ? { authorization } : undefined,
  })
}

test("protectWithBasicAuth returns 401 when authorization header is missing", async () => {
  const response = protectWithBasicAuth(createRequestWithAuthorization(), "admin", "secret")

  expect(response?.status).toBe(401)
  expect(response?.headers.get("WWW-Authenticate")).toBe(
    'Basic realm="Restricted", charset="UTF-8"',
  )
  expect(await response?.text()).toBe("Unauthorized")
})

test("protectWithBasicAuth returns 401 for non-basic authorization", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization("Bearer token"),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(401)
})

test("protectWithBasicAuth returns 401 for malformed basic authorization", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization("Basic invalid-base64%%%"),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(401)
})

test("protectWithBasicAuth returns 401 for wrong credentials", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization(`Basic ${btoa("admin:wrong")}`),
    "admin",
    "secret",
  )

  expect(response?.status).toBe(401)
})

test("protectWithBasicAuth returns null for matching credentials", () => {
  const response = protectWithBasicAuth(
    createRequestWithAuthorization(`Basic ${btoa("admin:secret")}`),
    "admin",
    "secret",
  )

  expect(response).toBeNull()
})
