import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { stdin } from "../cli/stdin.ts"
import { base64Encode } from "../encoding/base64Encode.ts"

const TEXT_ENCODER = new TextEncoder()

export async function crypt(data: string | object, key: string): Promise<string> {
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

async function main(): Promise<void> {
  const [key] = args()

  if (!key) {
    throw new Error("Missing key argument")
  }

  console.log(await crypt(await stdin(), key))
}

// echo "HelloWorld" | bun crypto/crypt.ts "secret"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
