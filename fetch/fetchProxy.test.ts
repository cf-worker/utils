import { expect, test } from "bun:test"
import { fetchProxy } from "./fetchProxy.ts"

test("fetchProxy", async () => {
  const req = new Request("https://google.com", {
    method: "POST",
    body: JSON.stringify({ hello: "world" }),
    headers: {
      "content-type": "application/json",
    },
  })
  const response = await fetchProxy(req, "https://echo.free.beeceptor.com")
  // deno-lint-ignore no-explicit-any
  const json = await response.json<any>()
  expect(json.method).toEqual("POST")
  expect(Object.keys(json.headers).includes("content-encoding")).toBe(false)
  expect(Object.keys(json.headers).includes("x-runtime-proxy")).toBe(false)
  expect(json.parsedBody).toEqual({ hello: "world" })
  expect(json.headers["Content-Type"]).toEqual("application/json")
})
