import { corsPreflight } from "./corsPreflight.ts"
import { setCors } from "./setCors.ts"

type RequestHandler<T extends unknown[]> = (req: Request, ...args: T) => Async<Response>

export function corsDecorator<T extends unknown[]>(handler: RequestHandler<T>): RequestHandler<T> {
  return async (req: Request, ...args: T) => corsPreflight(req) ?? setCors(await handler(req, ...args))
}
