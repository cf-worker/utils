import { base64Encode } from "../encoding/base64Encode.ts"

const TEXT_ENCODER = new TextEncoder()

/** Encrypts a string or object into a base64 token. */
export async function encrypt(data: string | object, key: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plainText = typeof data === "string" ? data : JSON.stringify(data)
  const cryptoKey = await createKey(key)
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    TEXT_ENCODER.encode(plainText),
  )
  const bytes = new Uint8Array(iv.byteLength + encrypted.byteLength)
  bytes.set(iv)
  bytes.set(new Uint8Array(encrypted), iv.byteLength)
  return base64Encode(bytes)
}

/** Derives an AES-GCM key from the provided passphrase. */
export async function createKey(
  key: string,
  keyUsages: KeyUsage[] = ["encrypt", "decrypt"],
): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", TEXT_ENCODER.encode(key)),
    "AES-GCM",
    false,
    keyUsages,
  )
}
