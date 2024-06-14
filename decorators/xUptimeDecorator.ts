export function xUptimeDecorator<T extends unknown[]>(handler: Handler<T>): Handler<T> {
  let bootTime: number

  return async (...args: T) => {
    bootTime = bootTime || Date.now()
    const response = await handler(...args)
    return setXUptime(bootTime, response)
  }
}

export function setXUptime(bootTime: number, response: Response) {
  const uptime = new Date(Date.now() - bootTime).toJSON().substring(11, 19)

  response.headers.set("X-Uptime", uptime)
  response.headers.set("X-Uptime-Boot", new Date(bootTime).toJSON())

  return response
}
