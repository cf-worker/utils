import { expect, spyOn, test } from "bun:test"
import { fetchJson } from "./fetchJson.ts"
import type { FetchError } from "./fetchThrow.ts"

test("fetchJson sets default headers and parses json", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  let seenRequest: Request | undefined
  fetchMock.mockImplementation(
    ((request: RequestInfo | URL) => {
      seenRequest = request as Request
      return Promise.resolve(
        new Response('{"Status":0}', {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )
    }) as typeof fetch,
  )
  try {
    const json = await fetchJson<{ Status: number }>("https://example.com/dns-query")
    expect("Status" in json).toBe(true)
    expect(json.Status).toBe(0)
    expect(seenRequest?.headers.get("accept")).toBe("application/json")
    expect(seenRequest?.headers.get("content-type")).toBe("application/json")
    expect(seenRequest?.signal).toBeInstanceOf(AbortSignal)
  } finally {
    fetchMock.mockRestore()
  }
})

test("fetchJson error", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  const request = new Request("https://example.com/405")
  fetchMock.mockImplementation(
    (() => Promise.resolve(new Response("Method Not Allowed", { status: 405 }))) as typeof fetch,
  )
  try {
    await fetchJson(request)
    expect(true).toBe(false)
  } catch (_) {
    const error = _ as FetchError
    expect(error.request?.url).toBe(request.url)
    expect(error.response).toBeInstanceOf(Response)
    expect(error.response.status).toBe(405)
    await error.response.body?.cancel()
  } finally {
    fetchMock.mockRestore()
  }
})

test("fetchJson propagates aborted request", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  const controller = new AbortController()
  controller.abort()
  fetchMock.mockImplementation(
    ((request: RequestInfo | URL) => {
      const req = request as Request
      if (req.signal.aborted) {
        throw new DOMException("Aborted", "AbortError")
      }
      return Promise.resolve(new Response("{}"))
    }) as typeof fetch,
  )
  try {
    await fetchJson("https://example.com/abort", { signal: controller.signal })
    expect(true).toBe(false)
  } catch (error) {
    expect(error).toBeInstanceOf(DOMException)
    expect((error as DOMException).name).toBe("AbortError")
  } finally {
    fetchMock.mockRestore()
  }
})

test("fetchJson throws on invalid json body", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  fetchMock.mockImplementation(
    (() =>
      Promise.resolve(
        new Response("<html>not-json</html>", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )) as typeof fetch,
  )
  try {
    await fetchJson("https://example.com/invalid-json")
    expect(true).toBe(false)
  } catch (error) {
    expect(error).toBeInstanceOf(SyntaxError)
  } finally {
    fetchMock.mockRestore()
  }
})
