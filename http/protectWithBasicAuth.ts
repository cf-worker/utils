function unauthorizedBasicAuthResponse() {
  return new Response("Not Found", { status: 404 })
}

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
