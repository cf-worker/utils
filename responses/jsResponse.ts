import { contentTypeResponse } from "./contentTypeResponse.ts"

/**
 * Creates a JavaScript response.
 *
 * @param {BodyInit | Response} body - The body of the response.
 * @param {ResponseInit} [init] - Optional additional options for the response.
 * @return {Response} The JavaScript response.
 */
export function jsResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "application/javascript", init)
}
