export function base64Encode(buffer: ArrayLike<number> | ArrayBufferLike): string {
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(buffer),
    ),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
