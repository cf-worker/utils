export type Async<T> = T | Promise<T>
export type Handler<T extends unknown[]> = (...args: T) => Async<Response>
