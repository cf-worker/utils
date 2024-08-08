import { contentTypeResponse } from "./contentTypeResponse.ts"

export function htmlResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "text/html", init)
}
