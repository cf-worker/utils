import { expect, test } from "bun:test"
import { emptyFaviconResponse } from "./emptyFaviconResponse.ts"

test("emptyFaviconResponse", () => {
  const response = emptyFaviconResponse()
  expect(response.status).toEqual(204)
  expect(response.statusText).toEqual("No Content")
  expect(response.headers.get("Content-Type")).toEqual("image/x-icon")
  expect(response.headers.get("Cache-Control")).toEqual("public, max-age=15552000")
})
