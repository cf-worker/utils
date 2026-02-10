import { contentTypeResponse } from "./contentTypeResponse.ts"

/**
 * Create an HTML response with the correct content type.
 */
export function htmlResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "text/html", init)
}
