import { expect, test } from "bun:test"
import { htmlResponse } from "./htmlResponse.ts"

test("htmlResponse", () => {
  const body = "Hello, World!"
  const init = { status: 200 }

  const response = htmlResponse(body, init)

  expect(response.status).toBe(200)
  expect(response.headers.get("Content-Type")).toBe("text/html;charset=UTF-8")
})
