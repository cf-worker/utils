import { expect, test } from "bun:test"
import { noContentResponse } from "./noContentResponse.ts"

test("noContentResponse", () => {
  const response = noContentResponse()

  expect(response.status).toEqual(204)
  expect(response.statusText).toEqual("No Content")
  expect(response.headers.get("Content-Length")).toEqual("0")
})
