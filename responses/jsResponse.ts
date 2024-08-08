import { contentTypeResponse } from "./contentTypeResponse.ts"

export function jsResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "application/javascript", init)
}
