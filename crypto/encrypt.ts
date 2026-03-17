import { stdin } from "../cli/stdin.ts"

function base64URLEncode(buffer: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

async function generateKeys(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-1",
    },
    true,
    ["encrypt", "decrypt"],
  )
}

async function privateKeyToPkcs8(privateKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey)
  return base64URLEncode(exported)
}

async function hybridEncrypt(data: string, publicKey: CryptoKey): Promise<string> {
  // Generate random AES key and IV
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt"],
  )
  const iv = crypto.getRandomValues(new Uint8Array(16))

  // Encrypt data with AES
  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    aesKey,
    new TextEncoder().encode(data),
  )

  // Export and encrypt AES key with RSA
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey)
  const encryptedKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawAesKey,
  )

  // Combine all components
  const combined = new Uint8Array(
    encryptedKey.byteLength + iv.byteLength + encryptedContent.byteLength,
  )
  combined.set(new Uint8Array(encryptedKey), 0)
  combined.set(iv, encryptedKey.byteLength)
  combined.set(new Uint8Array(encryptedContent), encryptedKey.byteLength + iv.byteLength)

  return base64URLEncode(combined)
}

/** Encrypts a string or object into a transport-safe token. */
export async function encrypt(data: string | object): Promise<string> {
  const stringData = typeof data === "string" ? data : JSON.stringify(data)
  const { privateKey, publicKey } = await generateKeys()
  const pkcs8 = await privateKeyToPkcs8(privateKey)
  const encrypted = await hybridEncrypt(stringData, publicKey)
  return `${encrypted}.${pkcs8}`
}

// echo "HelloWorld" | bun crypto/encrypt.ts | deno run crypto/decrypt.ts
// deno-coverage-ignore
if (import.meta.main) console.log(await encrypt(await stdin()))
