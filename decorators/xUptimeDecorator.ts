import type { Handler } from "../types.ts"

/**
 * Attach process uptime information to handler responses.
 */
export function xUptimeDecorator<T extends unknown[]>(handler: Handler<T>): Handler<T> {
  let bootTime: number

  return async (...args: T) => {
    bootTime = bootTime || Date.now()
    const response = await handler(...args)
    return setXUptime(response, bootTime)
  }
}

/**
 * Set the uptime header on a response.
 */
export function setXUptime(response: Response, bootTime: number): Response {
  const uptime = new Date(Date.now() - bootTime).toJSON().substring(11, 19)

  response.headers.set("X-Uptime", uptime)
  response.headers.set("X-Uptime-Boot", new Date(bootTime).toJSON())

  return response
}
