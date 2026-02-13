/**
 * fetch/fetchThrow module.
 * @module
 */
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

/**
 * Error thrown when an HTTP response is not `ok`.
 */
export class FetchError extends Error {
  /** Response returned by fetch. */
  public response: Response
  /** Optional originating request. */
  public request?: Request

  /** Create a `FetchError`. */
  constructor(response: Response, request?: Request) {
    super()
    this.response = response
    this.request = request
  }
}
