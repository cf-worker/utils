// deno-lint-ignore-file no-explicit-any
export type Async<T> = T | Promise<T>
export type Handler<T extends unknown[]> = (...args: T) => Async<Response>
export type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>
export type Dict<T = string> = Record<string, T | undefined>
export type MethodUrl = { method: string; url: string }
export type Func = (...args: any[]) => any
export type Rest<T extends (...args: unknown[]) => unknown> = T extends
  (_: infer F, ...rest: infer R) => unknown ? R
  : never
export type RouteMatcher = (methodUrl: MethodUrl) => Dict | undefined
export type RouteEntry<T> = [RouteMatcher, T]
