import { expect, test } from "bun:test"
import { base64Decode } from "../encoding/base64Decode.ts"
import { deobfuscate } from "./deobfuscate.ts"
import { generateObfuscationKeyPair, obfuscate } from "./obfuscate.ts"

let obfuscationFixturePromise:
  | Promise<{
    keyPair: CryptoKeyPair
    privateKeyBuffer: ArrayBuffer
    privateKeyBytes: Uint8Array<ArrayBuffer>
    privateKeyText: string
    tokenWithoutKey: string
  }>
  | undefined

function getObfuscationFixture() {
  obfuscationFixturePromise ??= (async () => {
    const keyPair = await generateObfuscationKeyPair()
    const tokenWithKey = await obfuscate("secret value", { keyPair })
    const [, privateKeyText] = tokenWithKey.split(".")
    const tokenWithoutKey = await obfuscate("secret value", { keyPair, embedPrivateKey: false })
    const decodedPrivateKeyBytes = base64Decode(privateKeyText)
    const privateKeyBuffer = new ArrayBuffer(decodedPrivateKeyBytes.byteLength)
    const privateKeyBytes = new Uint8Array<ArrayBuffer>(privateKeyBuffer)
    privateKeyBytes.set(decodedPrivateKeyBytes)

    return { keyPair, privateKeyBuffer, privateKeyBytes, privateKeyText, tokenWithoutKey }
  })()

  return obfuscationFixturePromise
}

test("deobfuscate restores the plaintext from an obfuscated token", async () => {
  const token = await obfuscate("secret value")

  expect(await deobfuscate(token)).toBe("secret value")
})

test("deobfuscate throws for malformed token format", async () => {
  try {
    await deobfuscate("invalid-token")
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid token format")
  }
})

test("deobfuscate throws for empty or over-split token formats", async () => {
  for (const token of [".key", "a.b.c"]) {
    try {
      await deobfuscate(token)
      expect(true).toBe(false)
    } catch (error) {
      expect((error as Error).message).toBe("Invalid token format")
    }
  }
})

test("deobfuscate throws for payloads shorter than key plus iv", async () => {
  const shortPayload = btoa("short").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  const privateKey = btoa("key").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  try {
    await deobfuscate(`${shortPayload}.${privateKey}`)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid encrypted payload")
  }
})

test("deobfuscate accepts a provided base64 private key", async () => {
  const { privateKeyText, tokenWithoutKey } = await getObfuscationFixture()

  expect(await deobfuscate(tokenWithoutKey, privateKeyText)).toBe("secret value")
})

test("deobfuscate accepts provided private key bytes", async () => {
  const { privateKeyBuffer, privateKeyBytes, tokenWithoutKey } = await getObfuscationFixture()

  expect(await deobfuscate(tokenWithoutKey, privateKeyBytes)).toBe("secret value")
  expect(await deobfuscate(tokenWithoutKey, privateKeyBuffer)).toBe("secret value")
})

test("deobfuscate throws when the token omits the private key and none is provided", async () => {
  const { tokenWithoutKey } = await getObfuscationFixture()

  try {
    await deobfuscate(tokenWithoutKey)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Missing private key")
  }
})
