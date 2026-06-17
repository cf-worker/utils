import { base64Encode } from "../encoding/base64Encode.ts"

const TEXT_ENCODER = new TextEncoder()
const DEFAULT_MODULUS_LENGTH = 2048
const PUBLIC_EXPONENT = new Uint8Array([1, 0, 1])
const RSA_HASH = "SHA-1"

const AES_ALGORITHM = {
  name: "AES-CBC",
  length: 256,
} as const

// This format is intentionally only for obfuscation. If someone intercepts the
// payload, the goal is to make it non-obvious how to deobfuscate it, not to provide
// strong confidentiality guarantees. It also keeps legacy RSA-OAEP/SHA-1 and
// AES-CBC choices for compatibility with older Ruby/Rails implementations.
/** Options for obfuscating a payload. */
export type ObfuscateOptions = {
  embedPrivateKey?: boolean
  keyPair?: CryptoKeyPair
  privateKeyText?: string
}

/** Options for generating an obfuscation key pair. */
export type GenerateObfuscationKeyPairOptions = {
  modulusLength?: number
}

function createRsaAlgorithm(modulusLength = DEFAULT_MODULUS_LENGTH) {
  return {
    name: "RSA-OAEP",
    modulusLength,
    publicExponent: PUBLIC_EXPONENT,
    hash: RSA_HASH,
  } as const
}

/** Generates a reusable RSA key pair for obfuscation. */
export async function generateObfuscationKeyPair(
  options: GenerateObfuscationKeyPairOptions = {},
): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    createRsaAlgorithm(options.modulusLength),
    true,
    ["encrypt", "decrypt"],
  )
}

/** Obfuscates a string or object into a transport-safe token. */
export async function obfuscate(
  data: string | object,
  options: ObfuscateOptions = {},
): Promise<string> {
  const plainText = typeof data === "string" ? data : JSON.stringify(data)
  const embedPrivateKey = options.embedPrivateKey ?? true
  const { privateKey, publicKey } = options.keyPair ?? await generateObfuscationKeyPair()
  const { aesKey, iv, ivBuffer } = await createAesKeyAndIv()
  const encryptedContent = await encryptWithAes(plainText, aesKey, ivBuffer)
  const encryptedAesKey = await encryptAesKeyWithRsa(aesKey, publicKey)
  const encryptedPayloadBytes = buildEncryptedPayload(encryptedAesKey, iv, encryptedContent)
  const encryptedPayload = base64Encode(encryptedPayloadBytes)

  if (!embedPrivateKey) {
    return encryptedPayload
  }

  const privateKeyPkcs8 = options.privateKeyText ??
    base64Encode(await exportPrivateKeyPkcs8Bytes(privateKey))
  return `${encryptedPayload}.${privateKeyPkcs8}`
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
    TEXT_ENCODER.encode(plainText),
  )
}

async function encryptAesKeyWithRsa(aesKey: CryptoKey, publicKey: CryptoKey) {
  return await crypto.subtle.encrypt(
    { name: createRsaAlgorithm().name },
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
