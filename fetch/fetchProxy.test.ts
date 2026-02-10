import { expect, spyOn, test } from "bun:test"
import { fetchProxy } from "./fetchProxy.ts"

test("fetchProxy", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  let seenRequest: Request | undefined
  fetchMock.mockImplementation(
    (async (request: RequestInfo | URL) => {
      seenRequest = request as Request
      return new Response(
        JSON.stringify({
          method: seenRequest.method,
          headers: Object.fromEntries(seenRequest.headers.entries()),
          body: await seenRequest.text(),
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-encoding": "gzip",
            "x-runtime-proxy": "old-value",
          },
        },
      )
    }) as typeof fetch,
  )
  const req = new Request("https://google.com", {
    method: "POST",
    body: JSON.stringify({ hello: "world" }),
    headers: {
      "content-type": "application/json",
    },
  })
  try {
    const response = await fetchProxy(req, "https://httpbin.org/anything")
    const json = await response.json()
    expect(json.method).toEqual("POST")
    expect(json.body).toEqual(JSON.stringify({ hello: "world" }))
    expect(json.headers["content-type"]).toEqual("application/json")
    expect(json.headers["host"]).toEqual("httpbin.org")
    expect(response.headers.get("content-encoding")).toBeNull()
    expect(response.headers.get("x-runtime-proxy")).toMatch(/\d+/)
  } finally {
    fetchMock.mockRestore()
  }
})
