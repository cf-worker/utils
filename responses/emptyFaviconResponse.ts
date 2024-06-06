export function emptyFaviconResponse(): Response {
  return new Response(null, {
    status: 204,
    statusText: "No Content",
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=15552000",
    },
  })
}
