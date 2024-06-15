export type Async<T> = T | Promise<T>
export type Handler<T extends unknown[]> = (...args: T) => Async<Response>
export type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>
export type Dict = Record<string, string | undefined>
