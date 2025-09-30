import { expect, test } from "bun:test"
import { corsPreflight } from "./corsPreflight.ts"

test("corsPreflight OPTIONS", () => {
  const request = new Request("https://example.com", {
    method: "OPTIONS",
  })
  const actualResponse = corsPreflight(request)
  expect(actualResponse).toBeInstanceOf(Response)
})

test("corsPreflight GET", () => {
  const request = new Request("https://example.com")
  const actualResponse = corsPreflight(request)
  expect(actualResponse).toBeUndefined()
})
