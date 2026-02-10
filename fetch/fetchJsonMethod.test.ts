import { expect, spyOn, test } from "bun:test"
import { fetchJsonMethod } from "./fetchJsonMethod.ts"

const url = "https://example.com/anything"

test("fetchJsonMethod", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  const requests: Request[] = []
  fetchMock.mockImplementation(
    (async (request: RequestInfo | URL) => {
      const req = request as Request
      requests.push(req)
      return new Response(
        JSON.stringify({
          method: req.method,
          body: await req.text(),
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      )
    }) as typeof fetch,
  )
  const body = { foo: "bar" }
  try {
    const json = await fetchJsonMethod<{ method: string; body: string }>(url).post(body)
    expect(json.method).toBe("POST")
    expect(json.body).toBe(JSON.stringify(body, null, 2))
    expect(requests[0].headers.get("content-type")).toBe("application/json")
  } finally {
    fetchMock.mockRestore()
  }
})

test("fetchJsonMethod DELETE empty data", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  let seenRequest: Request | undefined
  fetchMock.mockImplementation(
    ((request: RequestInfo | URL) => {
      seenRequest = request as Request
      return Promise.resolve(
        new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
      )
    }) as typeof fetch,
  )
  try {
    await fetchJsonMethod<Record<string, never>>(url).delete()
    expect(seenRequest?.method).toBe("DELETE")
    expect(await seenRequest?.text()).toBe("")
  } finally {
    fetchMock.mockRestore()
  }
})
