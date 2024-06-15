type Async<T> = T | Promise<T>
type Handler<T extends unknown[]> = (...args: T) => Async<Response>
