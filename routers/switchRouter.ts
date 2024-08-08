import type { Dict, MethodUrl } from "../types.ts"
import { matchUrl } from "./matchUrl.ts"

type Return = {
  methodPath: string
  params: Dict
  method: string
  path: string
  ANY: (pattern: string) => string | undefined
  GET: (pattern: string) => string | undefined
  PUT: (pattern: string) => string | undefined
  POST: (pattern: string) => string | undefined
  PATCH: (pattern: string) => string | undefined
  DELETE: (pattern: string) => string | undefined
}

export function switchRouter({ method, url }: MethodUrl, params: Dict = {}): Return {
  const path = new URL(url).pathname
  const methodPath = `${method} ${path}`
  const noop = (_: string) => undefined
  function ANY(pattern: string) {
    const args = matchUrl(pattern, url)
    if (args) {
      Object.assign(params, args, params)
      return methodPath
    }
  }

  return {
    methodPath,
    params,
    method,
    path,
    ANY,
    GET: method === "GET" ? ANY : noop,
    PUT: method === "PUT" ? ANY : noop,
    POST: method === "POST" ? ANY : noop,
    PATCH: method === "PATCH" ? ANY : noop,
    DELETE: method === "DELETE" ? ANY : noop,
  }
}
