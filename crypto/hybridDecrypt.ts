import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { base64Decode } from "../encoding/base64Decode.ts"
import { stdin } from "../cli/stdin.ts"
import { privateKeyFromText } from "./hybridKeyPair.ts"

const TEXT_DECODER = new TextDecoder()
const AES_ALGORITHM = {
  name: "AES-GCM",
  length: 256,
} as const

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
} as const

const TOKEN_VERSION = 1

/**
 * Decrypts a token created by {@link hybridEncrypt}.
 *
 * The token stores:
 * - a format version
 * - the RSA-encrypted AES key
 * - the AES-GCM IV
 * - the AES-GCM ciphertext
 *
 * Pass either a CryptoKey private key or text returned by
 * {@link privateKeyToPem}, {@link privateKeyToBase64}, or
 * {@link privateKeyToJwkText}.
 *
 * CLI:
 * `echo "$TOKEN" | bun crypto/hybridDecrypt.ts "$PRIVATE_KEY_TEXT"`
 *
 * For CLI usage, single-line base64 or JWK key text is easier than multiline PEM.
 */
export async function hybridDecrypt(
  token: string,
  privateKey: CryptoKey | string,
): Promise<string> {
  const importedPrivateKey = typeof privateKey === "string"
    ? await privateKeyFromText(privateKey)
    : privateKey
  const { encryptedContent, encryptedKey, iv } = parseToken(token)
  const aesKeyBytes = await crypto.subtle.decrypt(RSA_ALGORITHM, importedPrivateKey, encryptedKey)
  const aesKey = await crypto.subtle.importKey("raw", aesKeyBytes, AES_ALGORITHM, false, [
    "decrypt",
  ])
  const plainText = await crypto.subtle.decrypt(
    { name: AES_ALGORITHM.name, iv },
    aesKey,
    encryptedContent,
  )
  return TEXT_DECODER.decode(plainText)
}

function parseToken(token: string) {
  let bytes: Uint8Array

  try {
    bytes = base64Decode(token)
  } catch {
    throw new Error("Invalid hybrid token")
  }

  if (bytes.byteLength < 4) {
    throw new Error("Invalid hybrid token")
  }

  const version = bytes[0]
  const encryptedKeyLength = (bytes[1] << 8) | bytes[2]
  const ivLength = bytes[3]

  if (version !== TOKEN_VERSION || encryptedKeyLength <= 0 || ivLength <= 0) {
    throw new Error("Invalid hybrid token")
  }

  const encryptedKeyEnd = 4 + encryptedKeyLength
  const ivEnd = encryptedKeyEnd + ivLength

  if (bytes.byteLength <= ivEnd) {
    throw new Error("Invalid hybrid token")
  }

  return {
    encryptedContent: copyBytes(bytes.slice(ivEnd)),
    encryptedKey: copyBytes(bytes.slice(4, encryptedKeyEnd)),
    iv: copyBytes(bytes.slice(encryptedKeyEnd, ivEnd)),
  }
}

function copyBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(bytes.byteLength)
  const copy = new Uint8Array(buffer)
  copy.set(bytes)
  return copy
}

async function main(): Promise<void> {
  const [privateKeyText] = args()

  if (!privateKeyText) {
    throw new Error("Missing private key argument")
  }

  console.log(await hybridDecrypt(await stdin(), privateKeyText))
}

// echo "$TOKEN" | bun crypto/hybridDecrypt.ts "$PRIVATE_KEY_TEXT"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
