import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { stdin } from "../cli/stdin.ts"
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

async function main(): Promise<void> {
  const [privateKeyText] = args()

  if (!privateKeyText) {
    throw new Error("Missing private key argument")
  }

  console.log(await rsaDecrypt(await stdin(), privateKeyText))
}

// echo "$TOKEN" | bun crypto/rsaDecrypt.ts "$PRIVATE_KEY_TEXT"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
