// deno-lint-ignore-file no-explicit-any
type Async<T> = T | Promise<T>
type Handler<T extends unknown[]> = (...args: T) => Async<Response>
type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>
type Dict<T = string> = Record<string, T | undefined>
type MethodUrl = { method: string; url: string }
// biome-ignore lint/suspicious/noExplicitAny: unknow doesn't work here
type Func = (...args: any[]) => any
type Rest<T extends (...args: unknown[]) => unknown> = T extends (_: infer F, ...rest: infer R) => unknown ? R : never
type RouteMatcher = (methodUrl: MethodUrl) => Dict | undefined
type RouteEntry<T> = [RouteMatcher, T]
