/**
 * Create a response with a specific content type.
 */
export function contentTypeResponse(
  body: BodyInit | Response,
  contentType: string = "text/plain",
  init: ResponseInit = {},
): Response {
  if (body instanceof Response) return body

  // needed for Deno, cause HeadersInit does not includes Headers
  const headers: Headers = init.headers = new Headers(init.headers)
  headers.set("content-type", `${contentType};charset=UTF-8`)

  return new Response(body, init)
}
