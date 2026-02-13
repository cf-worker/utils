/**
 * fetch/fetchJsonMethod module.
 * @module
 */
import { fetchJson } from "./fetchJson.ts"

export type FetchJsonMethod<T> = (data?: unknown) => Promise<T>

export type FetchJsonMethodReturn<T> = {
  post: FetchJsonMethod<T>
  put: FetchJsonMethod<T>
  patch: FetchJsonMethod<T>
  delete: FetchJsonMethod<T>
}

/**
 * Easy fetch post with json body
 * @param input
 * @param init
 * @returns
 */
export function fetchJsonMethod<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): FetchJsonMethodReturn<T> {
  function buildMethod(method: string) {
    return (data?: unknown) => {
      const body = data === undefined ? undefined : JSON.stringify(data, null, 2)
      return fetchJson<T>(input, {
        ...init,
        method,
        body,
      })
    }
  }

  return {
    post: buildMethod("POST"),
    put: buildMethod("PUT"),
    patch: buildMethod("PATCH"),
    delete: buildMethod("DELETE"),
  }
}
