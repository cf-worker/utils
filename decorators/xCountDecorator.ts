/**
 * decorators/xCountDecorator module.
 * @module
 */
import type { Handler } from "../types.ts"

/**
 * Attach a request counter header to handler responses.
 */
export function xCountDecorator<T extends unknown[]>(handler: Handler<T>): Handler<T> {
  let count = 0
  return async (...args: T) => {
    const response = await handler(...args)
    count++
    response.headers.set("X-Count", String(count))
    return response
  }
}
