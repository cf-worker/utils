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
