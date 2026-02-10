/**
 * Return a 204 No Content response.
 */
export function noContentResponse(): Response {
  return new Response(null, {
    status: 204,
    statusText: "No Content",
    headers: { "Content-Length": "0" }, // https://github.com/expressjs/cors/blob/master/lib/index.js#L176
  })
}
