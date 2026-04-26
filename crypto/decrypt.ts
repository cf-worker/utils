import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { stdin } from "../cli/stdin.ts"
import { base64Decode } from "../encoding/base64Decode.ts"
import { createKey } from "./crypt.ts"
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

async function main(): Promise<void> {
  const [key] = args()

  if (!key) {
    throw new Error("Missing key argument")
  }

  console.log(await decrypt(await stdin(), key))
}

// echo "$TOKEN" | bun crypto/decrypt.ts "secret"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
