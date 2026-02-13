/**
 * routers/verbs module.
 * @module
 */
import type { MethodUrl, RouteMatcher } from "../types.ts"
import { matchUrl } from "./matchUrl.ts"

/**
 * HTTP-verb matcher factory function.
 */
export type Verb = (pattern: string) => RouteMatcher

/**
 * Normalize an HTTP verb string to a supported verb.
 */
export function verbify(verb: string): Verb {
  return (pattern: string) => ({ method, url }: MethodUrl) => {
    if (method === verb) return matchUrl(pattern, url)
  }
}

/**
 * Route matcher for `GET` requests.
 */
export const GET: Verb = verbify("GET")
/**
 * Route matcher for `POST` requests.
 */
export const POST: Verb = verbify("POST")
/**
 * Route matcher for `PUT` requests.
 */
export const PUT: Verb = verbify("PUT")
/**
 * Route matcher for `PATCH` requests.
 */
export const PATCH: Verb = verbify("PATCH")
/**
 * Route matcher for `DELETE` requests.
 */
export const DELETE: Verb = verbify("DELETE")
/**
 * Route matcher for `QUERY` requests.
 */
export const QUERY: Verb = verbify("QUERY")
