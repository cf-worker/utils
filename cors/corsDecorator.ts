import type { RequestHandler } from "../types.ts"
import { corsPreflight } from "./corsPreflight.ts"
import { setCors } from "./setCors.ts"

/**
 * Wrap a request handler with CORS handling.
 */
export function corsDecorator<T extends unknown[]>(handler: RequestHandler<T>): RequestHandler<T> {
  return async (req: Request, ...args: T) =>
    corsPreflight(req) ?? setCors(await handler(req, ...args))
}
