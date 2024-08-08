export function base64Decode(base64: string): Uint8Array {
  return Uint8Array.from(
    atob(
      base64
        .replace(/-/g, "+")
        .replace(/_/g, "/"),
    ),
    (c) => c.charCodeAt(0),
  )
}
