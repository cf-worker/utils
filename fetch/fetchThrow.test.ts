import { expect, test } from "bun:test"
import { type FetchError, fetchThrow } from "./fetchThrow.ts"

test("fetchThrow", async () => {
  const url = "https://example.com/cdn-cgi/foobar"
  const request = new Request(url)
  const response: Response = new Response("Not found", { status: 404 })
  try {
    await fetchThrow(Promise.resolve(response), request)
    // this line should never be reached
    expect(true).toBe(false)
  } catch (_) {
    const error = _ as FetchError
    expect(error.response).toBe(response)
    expect(error.request).toBe(request)
  }
})

test("fetchThrow returns response when ok", async () => {
  const response = new Response("ok", { status: 200 })
  const out = await fetchThrow(Promise.resolve(response))
  expect(out).toBe(response)
})
