import { base64Decode } from "../encoding/base64Decode.ts"
import { base64Encode } from "../encoding/base64Encode.ts"
import { args } from "../cli/args.ts"
import { setExitCode } from "../cli/setExitCode.ts"

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
} as const

const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----"
const PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----"
const PRIVATE_KEY_HEADER = "-----BEGIN PRIVATE KEY-----"
const PRIVATE_KEY_FOOTER = "-----END PRIVATE KEY-----"

/**
 * Generates an RSA key pair for hybrid encryption.
 *
 * Hybrid encryption uses the public key to wrap a random AES key and uses the
 * AES key to encrypt the actual payload. The matching private key unwraps the
 * AES key during decryption.
 */
export async function generateHybridKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(RSA_ALGORITHM, true, ["encrypt", "decrypt"])
}

/** Converts a public key to PEM text so it can be stored or shared. */
export async function publicKeyToText(publicKey: CryptoKey): Promise<string> {
  return await publicKeyToPem(publicKey)
}

/** Converts a private key to PEM text so it can be stored as plain text. */
export async function privateKeyToText(privateKey: CryptoKey): Promise<string> {
  return await privateKeyToPem(privateKey)
}

/** Converts a public key to PEM text. PEM is the common multiline text form. */
export async function publicKeyToPem(publicKey: CryptoKey): Promise<string> {
  const bytes = await crypto.subtle.exportKey("spki", publicKey)
  return wrapPem(PUBLIC_KEY_HEADER, PUBLIC_KEY_FOOTER, base64Encode(bytes))
}

/** Converts a private key to PEM text. PEM is the common multiline text form. */
export async function privateKeyToPem(privateKey: CryptoKey): Promise<string> {
  const bytes = await crypto.subtle.exportKey("pkcs8", privateKey)
  return wrapPem(PRIVATE_KEY_HEADER, PRIVATE_KEY_FOOTER, base64Encode(bytes))
}

/** Converts a public key to single-line base64 SPKI text. */
export async function publicKeyToBase64(publicKey: CryptoKey): Promise<string> {
  return base64Encode(await crypto.subtle.exportKey("spki", publicKey))
}

/** Converts a private key to single-line base64 PKCS#8 text. */
export async function privateKeyToBase64(privateKey: CryptoKey): Promise<string> {
  return base64Encode(await crypto.subtle.exportKey("pkcs8", privateKey))
}

/** Converts a public key to JWK JSON text. */
export async function publicKeyToJwkText(publicKey: CryptoKey): Promise<string> {
  return JSON.stringify(await crypto.subtle.exportKey("jwk", publicKey))
}

/** Converts a private key to JWK JSON text. */
export async function privateKeyToJwkText(privateKey: CryptoKey): Promise<string> {
  return JSON.stringify(await crypto.subtle.exportKey("jwk", privateKey))
}

/**
 * Imports a public key from PEM, single-line base64 SPKI, or JWK JSON text.
 */
export async function publicKeyFromText(publicKeyText: string): Promise<CryptoKey> {
  const normalized = publicKeyText.trim()

  if (normalized.startsWith(PUBLIC_KEY_HEADER)) {
    return await importPublicKeyFromSpkiBytes(
      pemToBytes(normalized, PUBLIC_KEY_HEADER, PUBLIC_KEY_FOOTER),
    )
  }

  if (normalized.startsWith("{")) {
    return await importPublicKeyFromJwkText(normalized)
  }

  return await importPublicKeyFromSpkiBytes(base64ToArrayBuffer(normalized))
}

/**
 * Imports a private key from PEM, single-line base64 PKCS#8, or JWK JSON text.
 */
export async function privateKeyFromText(privateKeyText: string): Promise<CryptoKey> {
  const normalized = privateKeyText.trim()

  if (normalized.startsWith(PRIVATE_KEY_HEADER)) {
    return await importPrivateKeyFromPkcs8Bytes(
      pemToBytes(normalized, PRIVATE_KEY_HEADER, PRIVATE_KEY_FOOTER),
    )
  }

  if (normalized.startsWith("{")) {
    return await importPrivateKeyFromJwkText(normalized)
  }

  return await importPrivateKeyFromPkcs8Bytes(base64ToArrayBuffer(normalized))
}

function wrapPem(header: string, footer: string, content: string): string {
  const lines: string[] = []
  for (let index = 0; index < content.length; index += 64) {
    lines.push(content.slice(index, index + 64))
  }
  return `${header}\n${lines.join("\n")}\n${footer}`
}

function pemToBytes(text: string, header: string, footer: string): ArrayBuffer {
  const normalized = text.trim()

  if (!normalized.startsWith(header) || !normalized.endsWith(footer)) {
    throw new Error("Invalid PEM format")
  }

  const base64 = normalized
    .slice(header.length, normalized.length - footer.length)
    .replace(/\s+/g, "")

  const bytes = base64Decode(base64)
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

function base64ToArrayBuffer(text: string): ArrayBuffer {
  const bytes = base64Decode(text)
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

async function importPublicKeyFromSpkiBytes(bytes: ArrayBuffer): Promise<CryptoKey> {
  return await crypto.subtle.importKey("spki", bytes, RSA_ALGORITHM, false, ["encrypt"])
}

async function importPrivateKeyFromPkcs8Bytes(bytes: ArrayBuffer): Promise<CryptoKey> {
  return await crypto.subtle.importKey("pkcs8", bytes, RSA_ALGORITHM, false, ["decrypt"])
}

async function importPublicKeyFromJwkText(text: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "jwk",
    JSON.parse(text),
    RSA_ALGORITHM,
    false,
    ["encrypt"],
  )
}

async function importPrivateKeyFromJwkText(text: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "jwk",
    JSON.parse(text),
    RSA_ALGORITHM,
    false,
    ["decrypt"],
  )
}

type KeyTextFormat = "pem" | "base64" | "jwk"

async function serializePublicKey(publicKey: CryptoKey, format: KeyTextFormat): Promise<string> {
  if (format === "base64") return await publicKeyToBase64(publicKey)
  if (format === "jwk") return await publicKeyToJwkText(publicKey)
  return await publicKeyToPem(publicKey)
}

async function serializePrivateKey(privateKey: CryptoKey, format: KeyTextFormat): Promise<string> {
  if (format === "base64") return await privateKeyToBase64(privateKey)
  if (format === "jwk") return await privateKeyToJwkText(privateKey)
  return await privateKeyToPem(privateKey)
}

function parseCliFormat(args: string[]): KeyTextFormat {
  const formatIndex = args.findIndex((arg) => arg === "--format" || arg === "-f")
  const formatValue = formatIndex >= 0 ? args[formatIndex + 1] : args[0]

  if (!formatValue || formatValue === "pem" || formatValue === "base64" || formatValue === "jwk") {
    return (formatValue ?? "pem") as KeyTextFormat
  }

  throw new Error("Invalid format. Use pem, base64, or jwk")
}

async function main(): Promise<void> {
  const format = parseCliFormat(args())
  const { publicKey, privateKey } = await generateHybridKeyPair()
  const publicKeyText = await serializePublicKey(publicKey, format)
  const privateKeyText = await serializePrivateKey(privateKey, format)

  console.log(JSON.stringify({ format, publicKey: publicKeyText, privateKey: privateKeyText }))
}

// bun crypto/hybridKeyPair.ts --format pem
// deno run crypto/hybridKeyPair.ts base64
if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
