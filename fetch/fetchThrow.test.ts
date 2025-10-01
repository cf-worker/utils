import { expect, test } from "bun:test"
import { type FetchError, fetchThrow } from "./fetchThrow.ts"

test("fetchThrow", async () => {
  const url = "https://www.cloudflare.com/cdn-cgi/foobar"
  const request = new Request(url)
  let response: Response = new Response()
  try {
    response = await fetch(request)
    await fetchThrow(response, request)
    // this line should never be reached
    expect(true).toBe(false)
  } catch (_) {
    const error = _ as FetchError
    expect(error.response).toBe(response)
    expect(error.request).toBe(request)
  } finally {
    await response.body?.cancel()
  }
})
