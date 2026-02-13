/**
 * cors/setCors module.
 * @module
 */
/**
 * Set CORS headers on a response.
 */
export function setCors(response: Response, request?: Request): Response {
  response.headers.set("Access-Control-Max-Age", "7200")
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS")
  response.headers.set(
    "Access-Control-Allow-Headers",
    request?.headers.get("Access-Control-Request-Headers") ??
      "accept, accept-language, authorization",
  )

  return response
}
