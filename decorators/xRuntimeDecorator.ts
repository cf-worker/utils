import type { Handler } from "../types.d.ts"

export const xRuntimeDecorator =
  <T extends unknown[]>(handler: Handler<T>): Handler<T> =>
  (...args: T) =>
    xRuntime(() => handler(...args))

export async function xRuntime(handler: Handler<unknown[]>): Promise<Response> {
  const start = Date.now()
  const response = await handler()
  response.headers.set("X-Runtime", `${Date.now() - start}ms`)
  return response
}
