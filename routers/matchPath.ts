import type { Dict } from "../types.ts"

/**
 * Match a pathname against a path pattern.
 */
export function matchPath(pattern: string, pathname: string): Dict | undefined {
  return new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
}
