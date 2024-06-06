export const matchPath = <Key extends string>(
  pattern: string,
  pathname: string,
): Record<Key, string | undefined> | undefined =>
  new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
