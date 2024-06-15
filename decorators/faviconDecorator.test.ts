import { assertEquals } from "@std/assert"
import { faviconDecorator } from "./faviconDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")
const decoratedHandler = faviconDecorator(mockHandler)

Deno.test("faviconDecorator should return empty favicon response when request URL ends with '/favicon.ico'", async () => {
  const request = new Request("https://example.com/favicon.ico")
  const response = await decoratedHandler(request)

  assertEquals(response.status, 204)
  assertEquals(response.statusText, "No Content")
  assertEquals(await response.text(), "")
  assertEquals(response.headers.get("Content-Type"), "image/x-icon")
  assertEquals(response.headers.get("Cache-Control"), "public, max-age=15552000")
})

Deno.test("faviconDecorator should call the original handler when request URL does not end with '/favicon.ico'", async () => {
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  assertEquals(response.status, 200)
  assertEquals(await response.text(), "Hello, world!")
})
