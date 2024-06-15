import { assertEquals } from "@std/assert"
import { xRuntimeDecorator } from "./xRuntimeDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")

Deno.test("xRuntimeDecorator add headers", async () => {
  const decoratedHandler = xRuntimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)
  assertEquals(response.status, 200)
  assertEquals(await response.text(), "Hello, world!")
  assertEquals(response.headers.get("X-Runtime"), "1ms")
  assertEquals(response.headers.get("X-Runtime-Rps"), "1000 req/s")
})
