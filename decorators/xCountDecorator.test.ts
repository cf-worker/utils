import { expect, test } from "bun:test"
import { xCountDecorator } from "./xCountDecorator.ts"

const mockHandler = (_request: Request) => new Response("Hello, world!")

test("xCountDecorator should increment count and set X-Count header", async () => {
  const decoratedHandler = xCountDecorator(mockHandler)
  const request = new Request("https://example.com")
  let response = await decoratedHandler(request)

  expect(response.status).toEqual(200)
  expect(await response.text()).toEqual("Hello, world!")
  expect(response.headers.get("X-Count")).toEqual("1")

  response = await decoratedHandler(request)
  expect(response.headers.get("X-Count")).toEqual("2")
})
