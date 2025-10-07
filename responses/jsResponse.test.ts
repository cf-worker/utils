import { expect, test } from "bun:test"
import { jsResponse } from "./jsResponse.ts"

test("jsResponse should create a JavaScript response with the correct content type", () => {
  const body = 'alert("Hello, world!");'
  const response = jsResponse(body)

  expect(response.headers.get("Content-Type")).toBe("text/javascript;charset=UTF-8")
})

test("jsResponse should create a JavaScript response with the provided body", async () => {
  const body = 'alert("Hello, world!");'
  const response = jsResponse(body)

  expect(await response.text()).toBe(body)
})

test("jsResponse should create a JavaScript response with the provided init options", () => {
  const body = 'alert("Hello, world!");'
  const init = { status: 200, headers: { "X-Custom-Header": "Test" } }
  const response = jsResponse(body, init)

  expect(response.status).toBe(200)
  expect(response.headers.get("X-Custom-Header")).toBe("Test")
})
