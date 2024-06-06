import { noContentResponse } from "../responses/noContentResponse.ts"
import { setCors } from "./setCors.ts"

export function corsPreflight(request: Request): Response | undefined {
  if (request.method === "OPTIONS") return setCors(noContentResponse(), request)
}
