export function matchPath<Key extends string>(
  pattern: string,
  pathname: string,
): Record<Key, string | undefined> | undefined {
  return new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
}
