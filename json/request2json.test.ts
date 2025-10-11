import { expect, test } from "bun:test"
import { request2json } from "./request2json.ts"
import { url2json } from "./url2json.ts"

test("request2json", () => {
  const headers = {
    "content-type": "text/plain",
    "powered-by": "bun",
  }
  const body = JSON.stringify({ hello: "world" })
  const request = new Request("data:", {
    method: "PUT",
    body,
    headers,
  })
  const result = request2json(request)
  const expected = {
    method: "PUT",
    url: url2json(request.url),
    bodyUsed: false,
    headers,
  }
  expect(result).toEqual(expected)
})
