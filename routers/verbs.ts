import type { MethodUrl, RouteMatcher } from "../types.ts"
import { matchUrl } from "./matchUrl.ts"

type Verb = (pattern: string) => RouteMatcher

export function verbify(verb: string): Verb {
  return (pattern: string) =>
    ({ method, url }: MethodUrl) => {
      if (method === verb) return matchUrl(pattern, url)
    }
}

export const GET: Verb = verbify("GET")
export const POST: Verb = verbify("POST")
export const PUT: Verb = verbify("PUT")
export const PATCH: Verb = verbify("PATCH")
export const DELETE: Verb = verbify("DELETE")
