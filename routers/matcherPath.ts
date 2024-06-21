export function matcherPath(pattern: string): (pathname: string) => Record<string, string | undefined> | undefined {
  const urlPattern = new URLPattern({ pathname: pattern })
  return (pathname: string) => urlPattern.exec({ pathname })?.pathname.groups
}
