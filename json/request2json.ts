import { headers2json } from "./headers2json.ts"
import { url2json, type URLJson } from "./url2json.ts"

type RequestJson = {
  method: string
  url?: URLJson
  bodyUsed: boolean
  headers: Record<string, string>
}

/**
 * Converts a Request object to a POJO
 * @param request
 * @returns
 */
export function request2json(request: Request): RequestJson {
  const url = url2json(request.url)
  return {
    method: request.method,
    url,
    bodyUsed: request.bodyUsed,
    headers: headers2json(request.headers),
  }
}
