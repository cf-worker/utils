import { contentTypeResponse } from "./contentTypeResponse.ts"

export * from "./emptyFaviconResponse.ts"
export * from "./noContentResponse.ts"

export function cssResponse(body: BodyInit | Response, init?: ResponseInit): Response {
  return contentTypeResponse(body, "text/css", init)
}
