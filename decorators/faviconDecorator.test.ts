import { expect, test } from "bun:test"
import { faviconDecorator } from "./faviconDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")
const decoratedHandler = faviconDecorator(mockHandler)

test("faviconDecorator should return empty favicon response when request URL ends with '/favicon.ico'", async () => {
  const request = new Request("https://example.com/favicon.ico")
  const response = await decoratedHandler(request)

  expect(response.status).toEqual(204)
  expect(response.statusText).toEqual("No Content")
  expect(await response.text()).toEqual("")
  expect(response.headers.get("Content-Type")).toEqual("image/x-icon")
  expect(response.headers.get("Cache-Control")).toEqual("public, max-age=15552000")
})

test("faviconDecorator should call the original handler when request URL does not end with '/favicon.ico'", async () => {
  const request = new Request("https://example.com")
  const response = await decoratedHandler(request)

  expect(response.status).toEqual(200)
  expect(await response.text()).toEqual("Hello, world!")
})
