import { contentTypeResponse } from "./contentTypeResponse.ts"

/**
 * Create a CSS response with the correct content type.
 */
export function cssResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "text/css", init)
}
