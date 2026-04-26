import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { stdin } from "../cli/stdin.ts"
import { base64Encode } from "../encoding/base64Encode.ts"
import { publicKeyFromText } from "./hybridKeyPair.ts"

const TEXT_ENCODER = new TextEncoder()

export async function rsaCrypt(data: string | object, publicKey: CryptoKey | string): Promise<string> {
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

async function main(): Promise<void> {
  const [publicKeyText] = args()

  if (!publicKeyText) {
    throw new Error("Missing public key argument")
  }

  console.log(await rsaCrypt(await stdin(), publicKeyText))
}

// echo "HelloWorld" | bun crypto/rsaCrypt.ts "$PUBLIC_KEY_TEXT"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
