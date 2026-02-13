/**
 * types module.
 * @module
 */
// deno-lint-ignore no-explicit-any
export type Func = (...args: any[]) => any
/** A value that can be synchronous or asynchronous. */
export type Async<T> = T | Promise<T>
/** Generic handler returning a `Response` (or promise of one). */
export type Handler<T extends unknown[]> = (...args: T) => Async<Response>
/** Request-first handler returning a `Response` (or promise of one). */
export type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>
/** Dictionary helper with optional values. */
export type Dict<T = string> = Record<string, T | undefined>
/** Pair of HTTP method and URL. */
export type MethodUrl = { method: string; url: string }
/** Rest tuple after removing the first argument of a function type. */
export type Rest<T extends (...args: unknown[]) => unknown> = T extends
  (_: infer F, ...rest: infer R) => unknown ? R
  : never
/** Function that matches a route and returns params when matched. */
export type RouteMatcher = (methodUrl: MethodUrl) => Dict | undefined
/** Route entry tuple `[matcher, handler]`. */
export type RouteEntry<T> = [RouteMatcher, T]
