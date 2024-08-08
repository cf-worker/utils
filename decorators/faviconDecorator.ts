import { emptyFaviconResponse } from "../responses/emptyFaviconResponse.ts"
import type { RequestHandler } from "../types.ts"

export function faviconDecorator<T extends unknown[]>(
  handler: RequestHandler<T>,
): RequestHandler<T> {
  return (request: Request, ...args: T) =>
    request.url.endsWith("/favicon.ico") ? emptyFaviconResponse() : handler(request, ...args)
}
