import { assertEquals } from "@std/assert"
import { corsDecorator } from "./corsDecorator.ts"

// deno-lint-ignore require-await
const mockHandler = async (_request: Request) => {
  return new Response("Hello, world!", {
    headers: new Headers({
      "Content-Type": "text/plain",
    }),
  })
}

Deno.test("corsDecorator should return response when method is not OPTIONS", async () => {
  const decoratedHandler = corsDecorator(mockHandler)

  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  assertEquals(response.status, 200)
  assertEquals(await response.text(), "Hello, world!")
  assertEquals(response.headers.get("Access-Control-Max-Age"), "7200")
})

Deno.test("corsDecorator should handle OPTIONS request and return 204 status", async () => {
  const decoratedHandler = corsDecorator(mockHandler)

  const request = new Request("https://example.com", {
    method: "OPTIONS",
  })
  const response = await decoratedHandler(request)

  assertEquals(response.status, 204)
  assertEquals(await response.text(), "")
})
