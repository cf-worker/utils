import { elapsed } from "../mod.ts"
import { addHeadersToResponse } from "./addHeadersToResponse.ts"

/**
 * Proxy a request to another url
 * @param req
 * @param originalUrl
 * @returns
 */
export async function fetchProxy(req: Request, originalUrl: string): Promise<Response> {
  const clone = req.clone()
  clone.headers.set("host", new URL(originalUrl).host)
  const proxyRequest = new Request(originalUrl, clone)
  elapsed("fetchProxy")
  const response = await fetch(proxyRequest)
  return addHeadersToResponse(response, {
    "X-Runtime-Proxy": elapsed("fetchProxy").toString(),
    "content-encoding": "", // removes
  })
}
