/**
 * routers/findRoute module.
 * @module
 */
import type { Dict, MethodUrl, RouteEntry } from "../types.ts"

/**
 * Find the matching route for a method and URL.
 */
export function findRoute<T = unknown>(
  routes: Iterable<RouteEntry<T>>,
  methodUrl: MethodUrl,
  params: Dict = {},
): T | undefined {
  for (const [route, handler] of routes) {
    const args = route(methodUrl)
    if (args) {
      Object.assign(params, args)
      return handler
    }
  }
}
