export type {}
declare global {
  type Async<T> = T | Promise<T>
  type Handler<T extends unknown[]> = (...args: T) => Async<Response>
  type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>
}
