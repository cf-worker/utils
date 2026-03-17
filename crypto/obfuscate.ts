import { base64Encode } from "../encoding/base64Encode.ts"
import { stdin } from "../cli/stdin.ts"

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-1",
} as const

const AES_ALGORITHM = {
  name: "AES-CBC",
  length: 256,
} as const

// This format is intentionally only for obfuscation. If someone intercepts the
// payload, the goal is to make it non-obvious how to deobfuscate it, not to provide
// strong confidentiality guarantees. It also keeps legacy RSA-OAEP/SHA-1 and
// AES-CBC choices for compatibility with older Ruby/Rails implementations.
/** Obfuscates a string or object into a transport-safe token. */
export async function obfuscate(data: string | object): Promise<string> {
  const plainText = typeof data === "string" ? data : JSON.stringify(data)
  const { privateKey, publicKey } = await generateRsaKeyPair()
  const privateKeyPkcs8Bytes = await exportPrivateKeyPkcs8Bytes(privateKey)
  const { aesKey, iv, ivBuffer } = await createAesKeyAndIv()
  const encryptedContent = await encryptWithAes(plainText, aesKey, ivBuffer)
  const encryptedAesKey = await encryptAesKeyWithRsa(aesKey, publicKey)
  const encryptedPayloadBytes = buildEncryptedPayload(encryptedAesKey, iv, encryptedContent)
  const encryptedPayload = base64Encode(encryptedPayloadBytes)
  const privateKeyPkcs8 = base64Encode(privateKeyPkcs8Bytes)

  return `${encryptedPayload}.${privateKeyPkcs8}`
}

async function generateRsaKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(RSA_ALGORITHM, true, ["encrypt", "decrypt"])
}

async function exportPrivateKeyPkcs8Bytes(privateKey: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey("pkcs8", privateKey)
}

async function createAesKeyAndIv() {
  const aesKey = await crypto.subtle.generateKey(AES_ALGORITHM, true, ["encrypt"])
  const ivBuffer = new ArrayBuffer(16)
  const iv = new Uint8Array(ivBuffer)
  crypto.getRandomValues(iv)

  return { aesKey, iv, ivBuffer }
}

async function encryptWithAes(plainText: string, aesKey: CryptoKey, ivBuffer: ArrayBuffer) {
  return await crypto.subtle.encrypt(
    { name: AES_ALGORITHM.name, iv: ivBuffer },
    aesKey,
    new TextEncoder().encode(plainText),
  )
}

async function encryptAesKeyWithRsa(aesKey: CryptoKey, publicKey: CryptoKey) {
  return await crypto.subtle.encrypt(
    { name: RSA_ALGORITHM.name },
    publicKey,
    await crypto.subtle.exportKey("raw", aesKey),
  )
}

function buildEncryptedPayload(
  encryptedKey: ArrayBuffer,
  iv: Uint8Array,
  encryptedContent: ArrayBuffer,
) {
  const combined = new Uint8Array(
    encryptedKey.byteLength + iv.byteLength + encryptedContent.byteLength,
  )
  combined.set(new Uint8Array(encryptedKey), 0)
  combined.set(iv, encryptedKey.byteLength)
  combined.set(new Uint8Array(encryptedContent), encryptedKey.byteLength + iv.byteLength)

  return combined
}

// echo "HelloWorld" | bun crypto/obfuscate.ts | deno run crypto/deobfuscate.ts
// deno-coverage-ignore
if (import.meta.main) console.log(await obfuscate(await stdin()))
