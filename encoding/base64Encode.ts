/**
 * Encodes a given buffer into a base64 string.
 *
 * @param {ArrayLike<number> | ArrayBufferLike} buffer - The buffer to be encoded.
 * @return {string} The base64 encoded string.
 * @see https://tc39.es/proposal-arraybuffer-base64/
 */
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
