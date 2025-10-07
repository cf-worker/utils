import { expect, test } from "bun:test"
import { headers2json } from "../json/headers2json.ts"
import { addHeadersToResponse } from "./addHeadersToResponse.ts"

test("addHeadersToResponse", () => {
  const response = new Response(null, {
    headers: {
      "Content-Type": "application/json",
      "Content-Encoding": "gzip",
    },
  })
  const newResponse = addHeadersToResponse(response, {
    "X-Runtime-Proxy": "123",
    "content-encoding": "",
  })

  expect(headers2json(newResponse.headers)).toEqual({
    "content-type": "application/json",
    "x-runtime-proxy": "123",
  })
})

test("addHeadersToResponse should preserve response data", async () => {
  const json = {
    foo: "bar",
  }
  const response = Response.json(json, {
    headers: {
      "Content-Encoding": "gzip",
    },
    status: 406,
    statusText: "Not Acceptable",
  })
  const newResponse = addHeadersToResponse(response, { "x-runtime-proxy": "123" })
  expect(newResponse.status).toBe(response.status)
  expect(newResponse.statusText).toBe(response.statusText)
  expect(newResponse.headers.get("x-runtime-proxy")).toBe("123")
  expect(await newResponse.json()).toEqual(await response.json())
  expect(newResponse.headers === response.headers).toBe(false)
})
