/**
 * json/response2json module.
 * @module
 */
import { headers2json } from "./headers2json.ts"
import { url2json, type URLJson } from "./url2json.ts"

/**
 * Serializable view of a `Response`.
 */
export type ResponseJson = {
  ok: boolean
  status: number
  statusText: string
  bodyUsed: boolean
  redirected: boolean
  type: string
  cf?: Record<string, unknown>
  url?: URLJson
  headers: Record<string, string>
}

/**
 * Converts a Response object to a POJO
 * @param response
 * @returns
 */
export function response2json(response: Response): ResponseJson {
  const url = url2json(response.url)
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    bodyUsed: response.bodyUsed,
    redirected: response.redirected,
    // deno-lint-ignore no-explicit-any
    cf: (response as any).cf,
    type: response.type,
    url,
    headers: headers2json(response.headers),
  }
}
