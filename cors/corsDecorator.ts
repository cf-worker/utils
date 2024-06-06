import { corsPreflight } from "./corsPreflight.ts"
import { setCors } from "./setCors.ts"

export function corsDecorator<T extends unknown[]>(handler: (req: Request, ...args: T) => Promise<Response>) {
  return async (req: Request, ...args: T) => corsPreflight(req) ?? setCors(await handler(req, ...args))
}
