import { expect, test } from "bun:test"
import { corsDecorator } from "./corsDecorator.ts"

// deno-lint-ignore require-await
const mockHandler = async (_request: Request) => {
  return new Response("Hello, world!", {
    headers: new Headers({
      "Content-Type": "text/plain",
    }),
  })
}

test("corsDecorator should return response when method is not OPTIONS", async () => {
  const decoratedHandler = corsDecorator(mockHandler)

  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  expect(response.status).toBe(200)
  expect(await response.text()).toBe("Hello, world!")
  expect(response.headers.get("Access-Control-Max-Age")).toBe("7200")
})

test("corsDecorator should handle OPTIONS request and return 204 status", async () => {
  const decoratedHandler = corsDecorator(mockHandler)

  const request = new Request("https://example.com", {
    method: "OPTIONS",
  })
  const response = await decoratedHandler(request)

  expect(response.status).toBe(204)
  expect(await response.text()).toBe("")
})
