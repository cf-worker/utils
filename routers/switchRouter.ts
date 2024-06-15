import { matchPath } from "./matchPath.ts"

type Params = { method: string; url: string }
type Return = {
  params: Dict
  ANY: (pattern: string) => string
  GET: (pattern: string) => string
  POST: (pattern: string) => string
  PUT: (pattern: string) => string
  PATCH: (pattern: string) => string
  DELETE: (pattern: string) => string
}

export function switchRouter({ method, url }: Params): Return {
  const path = new URL(url).pathname
  const params = {}

  function ANY(pattern: string): string {
    const args = matchPath(pattern, path)
    if (args) {
      Object.assign(params, args)
      return path
    }
    return ""
  }

  const noop = (_: string) => ""

  const GET = method === "GET" ? ANY : noop
  const PUT = method === "PUT" ? ANY : noop
  const POST = method === "POST" ? ANY : noop
  const PATCH = method === "PATCH" ? ANY : noop
  const DELETE = method === "DELETE" ? ANY : noop

  return { params, ANY, GET, POST, PUT, PATCH, DELETE }
}
