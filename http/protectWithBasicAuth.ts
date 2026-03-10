/**
 * http/protectWithBasicAuth module.
 * @module
 */
/**
 * Return the fallback response used when Basic Auth validation fails.
 */
function unauthorizedBasicAuthResponse() {
  return new Response("Not Found", { status: 404 })
}

/**
 * Protect a request using HTTP Basic Authentication.
 *
 * Returns `null` when the provided credentials match. Otherwise returns a
 * `404 Not Found` response to avoid exposing the protected endpoint.
 *
 * @param req - Incoming request that may contain an `Authorization` header.
 * @param expectedUsername - Expected Basic Auth username.
 * @param expectedPassword - Expected Basic Auth password.
 * @returns `null` for authorized requests, otherwise a `404` response.
 */
export function protectWithBasicAuth(
  req: Request,
  expectedUsername: string,
  expectedPassword: string,
): Response | null {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return unauthorizedBasicAuthResponse()

  try {
    const encoded = authHeader.slice("Basic ".length)
    const decoded = atob(encoded)
    const separatorIndex = decoded.indexOf(":")
    if (separatorIndex === -1) return unauthorizedBasicAuthResponse()

    const username = decoded.slice(0, separatorIndex)
    const password = decoded.slice(separatorIndex + 1)
    const isAuthorized = username === expectedUsername && password === expectedPassword

    return isAuthorized ? null : unauthorizedBasicAuthResponse()
  } catch {
    return unauthorizedBasicAuthResponse()
  }
}
