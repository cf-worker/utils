import type { Dict, MethodUrl } from "../types.ts"
import { matchUrl } from "./matchUrl.ts"

type Return = {
  params: Dict
  methodPath: string
  ANY: (pattern: string) => string | undefined
  GET: (pattern: string) => string | undefined
  POST: (pattern: string) => string | undefined
  PUT: (pattern: string) => string | undefined
  PATCH: (pattern: string) => string | undefined
  DELETE: (pattern: string) => string | undefined
}

export function switchRouter({ method, url }: MethodUrl, params: Dict = {}): Return {
  const path = new URL(url).pathname
  const methodPath = `${method} ${path}`
  function ANY(pattern: string) {
    const args = matchUrl(pattern, url)
    if (args) {
      Object.assign(params, args)
      return methodPath
    }
  }

  const noop = (_: string) => undefined

  const GET = method === "GET" ? ANY : noop
  const PUT = method === "PUT" ? ANY : noop
  const POST = method === "POST" ? ANY : noop
  const PATCH = method === "PATCH" ? ANY : noop
  const DELETE = method === "DELETE" ? ANY : noop

  return { params, methodPath, ANY, GET, POST, PUT, PATCH, DELETE }
}
