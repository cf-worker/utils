import { expect, test } from "bun:test"
import { response2json } from "./response2json.ts"

test("response2json", () => {
  const headers = {
    "content-type": "text/plain",
    "powered-by": "bun",
  }
  const body = JSON.stringify({ hello: "world" })
  const response = new Response(body, {
    headers,
    status: 201,
    statusText: "Created",
  })
  const result = response2json(response)
  const expected = {
    ok: true,
    headers,
    status: 201,
    statusText: "Created",
    bodyUsed: false,
    redirected: false,
    type: "default",
    cf: undefined,
    url: undefined,
  }
  expect(result).toEqual(expected)
})
