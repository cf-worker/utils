/**
 * Redirect to referer header or fallbackUrl or request.url
 * @param req
 * @param fallbackUrl
 * @returns
 */
export function redirectReferer(req: Request, fallbackUrl?: string): Response {
  const url = req.headers.get("referer") ?? fallbackUrl ?? req.url
  return Response.redirect(url)
}
