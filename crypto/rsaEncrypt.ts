import { base64Encode } from "../encoding/base64Encode.ts"
import { publicKeyFromText } from "./hybridKeyPair.ts"

const TEXT_ENCODER = new TextEncoder()

/** Encrypts a string or object with RSA-OAEP and returns base64 text. */
export async function rsaEncrypt(
  data: string | object,
  publicKey: CryptoKey | string,
): Promise<string> {
  const plainText = typeof data === "string" ? data : JSON.stringify(data)
  const importedPublicKey = typeof publicKey === "string"
    ? await publicKeyFromText(publicKey)
    : publicKey
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    importedPublicKey,
    TEXT_ENCODER.encode(plainText),
  )
  return base64Encode(encrypted)
}
