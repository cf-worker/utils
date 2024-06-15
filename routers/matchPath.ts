export function matchPath(pattern: string, pathname: string): Dict | undefined {
  return new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
}
