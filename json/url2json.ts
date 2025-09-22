type URLJson = Omit<URL, "toString" | "toJSON">

/**
 * You can't convert URL to json, this function fixes that
 * @param url URL
 * @returns URLJson
 */
export function url2json(url: URL): URLJson {
  const urlProperties: Record<string, unknown> = {}

  for (const key in url) {
    if (["toString", "toJSON", "searchParams"].includes(key)) continue
    urlProperties[key] = url[key as keyof URLJson]
  }
  urlProperties.searchParams = Object.fromEntries(url.searchParams)
  return urlProperties as URLJson
}
