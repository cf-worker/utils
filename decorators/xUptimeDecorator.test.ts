import { expect, test } from "bun:test"
import { setXUptime, xUptimeDecorator } from "./xUptimeDecorator.ts"

test("xUptimeDecorator sets X-Uptime header", async () => {
  const mockHandler = (_request: Request) => new Response("Hello, world!")
  const decoratedHandler = xUptimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  expect(response.headers.get("X-Uptime")).toEqual("00:00:00")
})

test("setXUptime sets X-Uptime and X-Uptime-Boot headers", () => {
  const response = new Response("Hello, world!")
  const bootTime = Date.now() - 10000

  const updatedResponse = setXUptime(response, bootTime)

  expect(updatedResponse.headers.get("X-Uptime")).toEqual("00:00:10")
  expect(updatedResponse.headers.get("X-Uptime-Boot")).toEqual(new Date(bootTime).toJSON())
})
