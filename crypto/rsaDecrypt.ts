import { base64Decode } from "../encoding/base64Decode.ts"
import { privateKeyFromText } from "./hybridKeyPair.ts"

const TEXT_DECODER = new TextDecoder()

export async function rsaDecrypt(token: string, privateKey: CryptoKey | string): Promise<string> {
  const importedPrivateKey = typeof privateKey === "string"
    ? await privateKeyFromText(privateKey)
    : privateKey
  const plainText = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    importedPrivateKey,
    base64Decode(token),
  )
  return TEXT_DECODER.decode(plainText)
}
