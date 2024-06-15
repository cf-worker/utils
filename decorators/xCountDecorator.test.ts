import { assertEquals } from "@std/assert"
import { xCountDecorator } from "./xCountDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")

Deno.test("xCountDecorator should increment count and set X-Count header", async () => {
  const decoratedHandler = xCountDecorator(mockHandler)
  const request = new Request("https://example.com")
  let response = await decoratedHandler(request)

  assertEquals(response.status, 200)
  assertEquals(await response.text(), "Hello, world!")
  assertEquals(response.headers.get("X-Count"), "1")

  response = await decoratedHandler(request)
  assertEquals(response.headers.get("X-Count"), "2")
})
