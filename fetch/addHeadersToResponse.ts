/**
 * fetch/addHeadersToResponse module.
 * @module
 */
/**
 * You can't change fetch response headers,
 * this function creates a new Response with the new headers added.
 * Add an empty string value header to remove it.
 * TypeError: Cannot change headers: headers are immutable
 * @param response
 * @param newHeaders
 * @returns
 */
export function addHeadersToResponse(response: Response, newHeaders: HeadersInit): Response {
  const headers = new Headers(response.headers)
  for (const [key, value] of new Headers(newHeaders)) {
    value === "" ? headers.delete(key) : headers.set(key, value)
  }

  return new Response(response.clone().body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
