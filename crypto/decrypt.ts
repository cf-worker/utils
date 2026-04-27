import { base64Decode } from "../encoding/base64Decode.ts"
import { createKey } from "./encrypt.ts"
const TEXT_DECODER = new TextDecoder()

export async function decrypt(token: string, key: string): Promise<string> {
  const bytes = base64Decode(token)
  const cryptoKey = await createKey(key)
  const plainText = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes.slice(0, 12) },
    cryptoKey,
    bytes.slice(12),
  )
  return TEXT_DECODER.decode(plainText)
}
