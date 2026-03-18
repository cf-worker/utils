import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"
import { base64Encode } from "../encoding/base64Encode.ts"
import { stdin } from "../cli/stdin.ts"
import { publicKeyFromText } from "./hybridKeyPair.ts"

const TEXT_ENCODER = new TextEncoder()
const AES_ALGORITHM = {
  name: "AES-GCM",
  length: 256,
} as const

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
} as const

const TOKEN_VERSION = 1
const IV_LENGTH = 12

/**
 * Encrypts data using hybrid encryption.
 *
 * How it works:
 * 1. Generate a random AES key for this one payload.
 * 2. Encrypt the payload with AES-GCM.
 * 3. Encrypt the AES key with the receiver's RSA public key.
 * 4. Return one token that contains the wrapped AES key, IV, and ciphertext.
 *
 * Usage:
 * ```ts
 * import {
 *   generateHybridKeyPair,
 *   hybridDecrypt,
 *   hybridEncrypt,
 *   publicKeyToPem,
 * } from "../mod.ts"
 *
 * const { publicKey, privateKey } = await generateHybridKeyPair()
 * const publicKeyText = await publicKeyToPem(publicKey) // or publicKeyToBase64/publicKeyToJwkText
 * const token = await hybridEncrypt("hello", publicKeyText)
 * const text = await hybridDecrypt(token, privateKey)
 * ```
 *
 * CLI:
 * `echo "hello" | bun crypto/hybridEncrypt.ts "$PUBLIC_KEY_TEXT"`
 *
 * For CLI usage, single-line base64 or JWK key text is easier than multiline PEM.
 */
export async function hybridEncrypt(
  data: string | object,
  publicKey: CryptoKey | string,
): Promise<string> {
  const plainText = typeof data === "string" ? data : JSON.stringify(data)
  const importedPublicKey = typeof publicKey === "string"
    ? await publicKeyFromText(publicKey)
    : publicKey
  const aesKey = await crypto.subtle.generateKey(AES_ALGORITHM, true, ["encrypt"])
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encryptedContent = await crypto.subtle.encrypt(
    { name: AES_ALGORITHM.name, iv },
    aesKey,
    TEXT_ENCODER.encode(plainText),
  )
  const encryptedKey = await crypto.subtle.encrypt(
    RSA_ALGORITHM,
    importedPublicKey,
    await crypto.subtle.exportKey("raw", aesKey),
  )

  return base64Encode(
    buildPayload(new Uint8Array(encryptedKey), iv, new Uint8Array(encryptedContent)),
  )
}

function buildPayload(
  encryptedKey: Uint8Array,
  iv: Uint8Array,
  encryptedContent: Uint8Array,
): Uint8Array {
  const combined = new Uint8Array(
    4 + encryptedKey.byteLength + iv.byteLength + encryptedContent.byteLength,
  )
  combined[0] = TOKEN_VERSION
  combined[1] = encryptedKey.byteLength >> 8
  combined[2] = encryptedKey.byteLength & 0xff
  combined[3] = iv.byteLength
  combined.set(encryptedKey, 4)
  combined.set(iv, 4 + encryptedKey.byteLength)
  combined.set(encryptedContent, 4 + encryptedKey.byteLength + iv.byteLength)
  return combined
}

async function main(): Promise<void> {
  const [publicKeyText] = args()

  if (!publicKeyText) {
    throw new Error("Missing public key argument")
  }

  console.log(await hybridEncrypt(await stdin(), publicKeyText))
}

// echo "HelloWorld" | bun crypto/hybridEncrypt.ts "$PUBLIC_KEY_TEXT"
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
