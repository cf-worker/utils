import { assertEquals } from "@std/assert"
import { emptyFaviconResponse } from "./emptyFaviconResponse.ts"

Deno.test("emptyFaviconResponse", () => {
  const response = emptyFaviconResponse()
  assertEquals(response.status, 204)
  assertEquals(response.statusText, "No Content")
  assertEquals(response.headers.get("Content-Type"), "image/x-icon")
  assertEquals(response.headers.get("Cache-Control"), "public, max-age=15552000")
})
