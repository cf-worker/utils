import { expect, test } from "bun:test"
import { xRuntimeDecorator } from "./xRuntimeDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")

test("xRuntimeDecorator add headers", async () => {
  const decoratedHandler = xRuntimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)
  expect(response.status).toEqual(200)
  expect(await response.text()).toEqual("Hello, world!")
  expect(response.headers.get("X-Runtime")).toEqual("1ms")
  expect(response.headers.get("X-Runtime-Rps")).toEqual("1000 req/s")
})
