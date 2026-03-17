/**
 * encoding/base64Encode module.
 * @module
 */
/**
 * Encodes a given buffer into a base64 string url safe.
 *
 * @param {ArrayBuffer | ArrayBufferView | ArrayLike<number>} buffer - The buffer to be encoded.
 * @return {string} The base64 encoded string.
 * @see https://tc39.es/proposal-arraybuffer-base64/
 */
export function base64Encode(buffer: ArrayBuffer | ArrayBufferView | ArrayLike<number>): string {
  const view = ArrayBuffer.isView(buffer)
    ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    : new Uint8Array(buffer as ArrayBuffer | ArrayLike<number>)

  return btoa(
    String.fromCharCode(
      ...view,
    ),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
