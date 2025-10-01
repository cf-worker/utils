import { expect, test } from "bun:test"
import { fetchJson } from "./fetchJson.ts"
import type { FetchError } from "./fetchThrow.ts"

test("fetchJson", async () => {
  const request = new Request("https://cloudflare-dns.com/dns-query?name=example.com&type=A", {
    headers: {
      Accept: "application/dns-json",
    },
  })
  const json = await fetchJson<{ Status: number }>(request)
  expect("Status" in json).toBe(true)
  expect(json.Status).toBe(0)
})

test("fetchJson error", async () => {
  const request = new Request("https://cloudflare.com/cdn-cgi/rum")
  try {
    await fetchJson(request)
  } catch (_) {
    const error = _ as FetchError
    expect(error.request?.url).toBe(request.url)
    expect(error.response).toBeInstanceOf(Response)
    expect(error.response.status).toBe(405)
    await error.response.body?.cancel()
  }
})
