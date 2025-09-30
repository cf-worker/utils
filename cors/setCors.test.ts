import { expect, test } from "bun:test"
import { setCors } from "./setCors.ts"

test("setCors", () => {
  const response = new Response()
  const request = new Request("https://example.com", {
    headers: new Headers({
      "Access-Control-Request-Headers": "content-type,x-pingother",
    }),
  })

  let result = setCors(response, request)

  expect(result.headers.get("Access-Control-Max-Age")).toBe("7200")
  expect(result.headers.get("Access-Control-Allow-Origin")).toBe("*")
  expect(result.headers.get("Access-Control-Allow-Credentials")).toBe("true")
  expect(
    result.headers.get("Access-Control-Allow-Methods"),
  ).toBe(
    "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
  )
  expect(result.headers.get("Access-Control-Allow-Headers")).toBe("content-type,x-pingother")

  request.headers.delete("Access-Control-Request-Headers")
  result = setCors(response, request)
  expect(
    result.headers.get("Access-Control-Allow-Headers"),
  ).toBe(
    "accept, accept-language, authorization",
  )
})
