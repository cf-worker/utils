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
  const response = await fetchProxy(req, "https://httpbin.org/anything")
  const json = await response.json()
  expect(json.method).toEqual("POST")
  expect(Object.keys(json.headers).includes("content-encoding")).toBe(false)
  expect(Object.keys(json.headers).includes("x-runtime-proxy")).toBe(false)
  expect(json.json).toEqual({ hello: "world" })
  expect(json.headers["Content-Type"]).toEqual("application/json")
})
