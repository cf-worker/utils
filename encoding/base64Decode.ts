/**
 * encoding/base64Decode module.
 * @module
 */
/**
 * Decodes a base64 encoded string into a Uint8Array.
 *
 * @param {string} base64 - The base64 encoded string to be decoded.
 * @return {Uint8Array} The decoded Uint8Array.
 */
export function base64Decode(base64: string): Uint8Array<ArrayBuffer> {
  const text = atob(
    base64
      .replace(/-/g, "+")
      .replace(/_/g, "/"),
  )
  const buffer = new ArrayBuffer(text.length)
  const bytes = new Uint8Array(buffer)

  for (let index = 0; index < text.length; index += 1) {
    bytes[index] = text.charCodeAt(index)
  }

  return bytes
}
