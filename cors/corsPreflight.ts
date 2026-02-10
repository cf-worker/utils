import { noContentResponse } from "../responses/noContentResponse.ts"
import { setCors } from "./setCors.ts"

/**
 * Handle CORS preflight requests and return a response when needed.
 */
export function corsPreflight(request: Request): Response | undefined {
  if (request.method === "OPTIONS") return setCors(noContentResponse(), request)
}
