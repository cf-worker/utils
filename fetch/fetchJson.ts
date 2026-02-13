/**
 * fetch/fetchJson module.
 * @module
 */
import { fetchThrow } from "./fetchThrow.ts"
import { responseJson } from "./responseJson.ts"

/**
 * Easy json fetch
 * @param input
 * @param init
 * @returns
 */
export function fetchJson<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  init.signal ??= AbortSignal.timeout(fetchJson.timeout)
  const request = new Request(input, init)
  if (!request.headers.has("accept")) {
    request.headers.set("accept", "application/json")
  }
  request.headers.set("content-type", "application/json")

  return responseJson<T>(fetchThrow(fetch(request), request))
}

fetchJson.timeout = 10_000
