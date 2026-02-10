import { expect, test } from "bun:test"
import { setXRuntime, xRuntimeDecorator } from "./xRuntimeDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")

test("xRuntimeDecorator add headers", async () => {
  const decoratedHandler = xRuntimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)
  expect(response.status).toEqual(200)
  expect(await response.text()).toEqual("Hello, world!")
  expect(response.headers.get("X-Runtime")).toMatch(/\d+ms/)
  expect(response.headers.get("X-Runtime-Rps")).toMatch(/^\d+(\.\d+)? req\/s$/)
})

test("setXRuntime overwrites existing runtime headers", () => {
  const originalNow = Date.now
  Date.now = () => 5_000
  try {
    const response = new Response("ok", {
      headers: {
        "X-Runtime": "stale",
        "X-Runtime-Rps": "stale",
      },
    })
    const updated = setXRuntime(response, 4_995)
    expect(updated.headers.get("X-Runtime")).toBe("5ms")
    expect(updated.headers.get("X-Runtime-Rps")).toBe("200 req/s")
  } finally {
    Date.now = originalNow
  }
})
