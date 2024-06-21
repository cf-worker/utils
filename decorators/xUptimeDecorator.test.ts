import { assertEquals } from "@std/assert"
import { setXUptime, xUptimeDecorator } from "./xUptimeDecorator.ts"

Deno.test("xUptimeDecorator sets X-Uptime header", async () => {
  const mockHandler = (_request: Request) => new Response("Hello, world!")
  const decoratedHandler = xUptimeDecorator(mockHandler)
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  assertEquals(response.headers.get("X-Uptime"), "00:00:00")
})

Deno.test("setXUptime sets X-Uptime and X-Uptime-Boot headers", () => {
  const response = new Response("Hello, world!")
  const bootTime = Date.now() - 10000

  const updatedResponse = setXUptime(response, bootTime)

  assertEquals(updatedResponse.headers.get("X-Uptime"), "00:00:10")
  assertEquals(updatedResponse.headers.get("X-Uptime-Boot"), new Date(bootTime).toJSON())
})
