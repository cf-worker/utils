/**
 * routers/matchUrl module.
 * @module
 */
import type { Dict } from "../types.ts"

/**
 * Match a pathname against a URL pattern.
 */
export function matchUrl(pathname: string, url: string): Dict | undefined {
  return new URLPattern({ pathname }).exec(url, "data:/")?.pathname.groups
}
