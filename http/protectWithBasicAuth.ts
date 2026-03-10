/**
 * http/protectWithBasicAuth module.
 * @module
 */
/**
 * Return the fallback response used when Basic Auth validation fails.
 */
function unauthorizedBasicAuthResponse() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"',
    },
  })
}

/**
 * Protect a request using HTTP Basic Authentication.
 *
 * Returns `null` when the provided credentials match. Otherwise returns a
 * `401 Unauthorized` response with a `WWW-Authenticate` challenge so browsers
 * can prompt for credentials.
 *
 * @param req - Incoming request that may contain an `Authorization` header.
 * @param expectedUsername - Expected Basic Auth username.
 * @param expectedPassword - Expected Basic Auth password.
 * @returns `null` for authorized requests, otherwise a `401` response.
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
