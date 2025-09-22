import { expect, test } from "bun:test"
import { headers2json } from "./headers2json.ts"

test("headers2json", () => {
  const expected = {
    "content-type": "text/plain",
    "powered-by": "bun",
  }
  const headers = new Headers({
    "Powered-By": "bun",
    "Content-Type": "text/plain",
  })
  const result = headers2json(headers)
  expect(result).toEqual(expected)
})
