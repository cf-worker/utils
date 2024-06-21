export function matchUrl(pathname: string, url: string): Dict | undefined {
  return new URLPattern({ pathname }).exec(url, "data:/")?.pathname.groups
}
