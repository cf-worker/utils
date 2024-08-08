import { expect, test } from "bun:test"
import { cssResponse } from "./cssResponse.ts"

test("cssResponse", () => {
  const body = "Hello, World!"
  const init = { status: 200 }

  const response = cssResponse(body, init)

  expect(response.status).toBe(200)
  expect(response.headers.get("Content-Type")).toBe("text/css;charset=UTF-8")
})
