import { contentTypeResponse } from "./contentTypeResponse.ts"

export function cssResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "text/css", init)
}
