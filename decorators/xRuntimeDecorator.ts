export function xRuntimeDecorator<T extends unknown[]>(handler: Handler<T>): Handler<T> {
  return (...args: T) => xRuntime(() => handler(...args))
}

export async function xRuntime(handler: Handler<unknown[]>): Promise<Response> {
  const start = Date.now()
  const response = await handler()
  return setXRuntime(response, start)
}

export function setXRuntime(response: Response, start: number): Response {
  const elapsed = Math.max(Date.now() - start, 1)

  response.headers.set("X-Runtime", `${elapsed}ms`)
  response.headers.set("X-Runtime-Rps", `${1000 / elapsed} req/s`)

  return response
}
