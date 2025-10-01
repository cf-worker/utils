import { tryJson } from "../json/tryJson.ts"

/**
 * Safely return json from Response
 * @param response
 * @returns
 */
export async function responseJson<T>(response: Response | Promise<Response>): Promise<T> {
  const text = await (await response).text()
  return tryJson(text) as T
}
