import { assertEquals, assertInstanceOf } from "@std/assert"
import { corsPreflight } from "./corsPreflight.ts"

Deno.test("corsPreflight OPTIONS", () => {
  const request = new Request("https://example.com", {
    method: "OPTIONS",
  })
  const actualResponse = corsPreflight(request)
  assertInstanceOf(actualResponse, Response)
})

Deno.test("corsPreflight GET", () => {
  const request = new Request("https://example.com")
  const actualResponse = corsPreflight(request)
  assertEquals(actualResponse, undefined)
})
