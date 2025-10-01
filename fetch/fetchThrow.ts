/**
 * Throw error when fetch response is not ok
 * @param promise
 * @param request
 * @returns
 */
export async function fetchThrow(
  promise: Promise<Response> | Response,
  request?: Request,
): Promise<Response> {
  const response = await promise
  if (response.ok) {
    return promise
  } else {
    throw new FetchError(response, request)
  }
}

export class FetchError extends Error {
  public response: Response
  public request?: Request

  constructor(response: Response, request?: Request) {
    super()
    this.response = response
    this.request = request
  }
}
