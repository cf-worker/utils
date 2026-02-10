import { expect, test } from "bun:test"
import { setXUptime, xUptimeDecorator } from "./xUptimeDecorator.ts"

test("xUptimeDecorator sets X-Uptime header", async () => {
  const originalNow = Date.now
  const nowValues = [20_000, 20_000]
  Date.now = () => nowValues.shift() ?? originalNow()
  const mockHandler = (_request: Request) => new Response("Hello, world!")
  const decoratedHandler = xUptimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  try {
    const response = await decoratedHandler(request)
    expect(response.headers.get("X-Uptime")).toMatch(/^00:00:0\d$/)
  } finally {
    Date.now = originalNow
  }
})

test("setXUptime sets X-Uptime and X-Uptime-Boot headers", () => {
  const response = new Response("Hello, world!")
  const bootTime = Date.now() - 10000

  const updatedResponse = setXUptime(response, bootTime)

  expect(updatedResponse.headers.get("X-Uptime")).toEqual("00:00:10")
  expect(updatedResponse.headers.get("X-Uptime-Boot")).toEqual(new Date(bootTime).toJSON())
})

test("setXUptime overwrites existing uptime headers", () => {
  const originalNow = Date.now
  Date.now = () => 11_000
  try {
    const response = new Response("Hello, world!", {
      headers: {
        "X-Uptime": "stale",
        "X-Uptime-Boot": "stale",
      },
    })
    const updatedResponse = setXUptime(response, 1_000)
    expect(updatedResponse.headers.get("X-Uptime")).toBe("00:00:10")
    expect(updatedResponse.headers.get("X-Uptime-Boot")).toBe(new Date(1_000).toJSON())
  } finally {
    Date.now = originalNow
  }
})
