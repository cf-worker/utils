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
