import type { Dict, MethodUrl } from "../types.ts"
import { matchUrl } from "./matchUrl.ts"

type LooseObject<T extends Record<string, unknown>> = T & {
  [key: string]: string | undefined
}

type Return<P extends Record<string, unknown>> = {
  methodPath: string
  params: LooseObject<P>
  method: string
  path: string
  ANY: (pattern: string) => string | undefined
  GET: (pattern: string) => string | undefined
  PUT: (pattern: string) => string | undefined
  POST: (pattern: string) => string | undefined
  PATCH: (pattern: string) => string | undefined
  QUERY: (pattern: string) => string | undefined
  DELETE: (pattern: string) => string | undefined
}

export function switchRouter<Fixed extends Record<string, unknown>, Default extends Dict>(
  { method, url }: MethodUrl,
  params: Fixed = {} as Fixed,
  defaultParams?: Default,
): Return<Fixed & Default> {
  const path = new URL(url).pathname
  const methodPath = `${method} ${path}`
  const noop = (_: string) => undefined
  const fixedParams = Object.assign({}, params)
  function ANY(pattern: string) {
    const args = matchUrl(pattern, url)
    if (args) {
      Object.assign(params, defaultParams, args, fixedParams)
      return methodPath
    }
  }

  return {
    methodPath,
    params: params as LooseObject<Fixed & Default>,
    method,
    path,
    ANY,
    GET: method === "GET" ? ANY : noop,
    PUT: method === "PUT" ? ANY : noop,
    POST: method === "POST" ? ANY : noop,
    PATCH: method === "PATCH" ? ANY : noop,
    QUERY: method === "QUERY" ? ANY : noop,
    DELETE: method === "DELETE" ? ANY : noop,
  }
}
