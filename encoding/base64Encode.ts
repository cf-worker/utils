export function base64Encode(buffer: ConstructorParameters<typeof Uint8Array>): string {
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(buffer),
    ),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
