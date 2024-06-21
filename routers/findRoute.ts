export function findRoute<T = unknown>(
  routes: Iterable<RouteEntry<T>>,
  methodUrl: MethodUrl,
  params: Dict = {},
): T | undefined {
  for (const [route, handler] of routes) {
    const args = route(methodUrl)
    if (args) {
      Object.assign(params, args)
      return handler
    }
  }
}
