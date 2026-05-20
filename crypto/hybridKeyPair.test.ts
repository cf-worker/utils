import { expect, test } from "bun:test"
import { getHybridTestFixture } from "./hybridTestFixtures.ts"
import {
  generateHybridKeyPairText,
  parseCliFormat,
  privateKeyFromText,
  privateKeyToJwkText,
  privateKeyToPem,
  publicKeyFromText,
  publicKeyToJwkText,
  publicKeyToPem,
} from "./hybridKeyPair.ts"

let hybridKeyPairFixturePromise:
  | Promise<{
    privateKey: CryptoKey
    privateKeyBase64: string
    privateKeyJwkText: string
    privateKeyPem: string
    privateKeyText: string
    publicKey: CryptoKey
    publicKeyBase64: string
    publicKeyJwkText: string
    publicKeyPem: string
    publicKeyText: string
  }>
  | undefined

function getHybridKeyPairFixture() {
  hybridKeyPairFixturePromise ??= (async () => {
    const {
      privateKey,
      privateKeyBase64,
      privateKeyText,
      publicKey,
      publicKeyBase64,
      publicKeyText,
    } = await getHybridTestFixture()
    return {
      privateKey,
      privateKeyBase64,
      privateKeyJwkText: await privateKeyToJwkText(privateKey),
      privateKeyPem: await privateKeyToPem(privateKey),
      privateKeyText,
      publicKey,
      publicKeyBase64,
      publicKeyJwkText: await publicKeyToJwkText(publicKey),
      publicKeyPem: await publicKeyToPem(publicKey),
      publicKeyText,
    }
  })()

  return hybridKeyPairFixturePromise
}

test("generateHybridKeyPair returns usable RSA keys", async () => {
  const { privateKey, publicKey } = await getHybridKeyPairFixture()

  expect(privateKey.type).toBe("private")
  expect(publicKey.type).toBe("public")
})

test("publicKeyToText and privateKeyToText return PEM text", async () => {
  const { privateKeyText, publicKeyText } = await getHybridKeyPairFixture()

  expect(publicKeyText.startsWith("-----BEGIN PUBLIC KEY-----")).toBe(true)
  expect(privateKeyText.startsWith("-----BEGIN PRIVATE KEY-----")).toBe(true)
})

test("generateHybridKeyPairText serializes PEM keys by default", async () => {
  const keyPair = await generateHybridKeyPairText()

  expect(keyPair.format).toBe("pem")
  expect(keyPair.publicKey.startsWith("-----BEGIN PUBLIC KEY-----")).toBe(true)
  expect(keyPair.privateKey.startsWith("-----BEGIN PRIVATE KEY-----")).toBe(true)
})

test("generateHybridKeyPairText serializes base64 keys", async () => {
  const keyPair = await generateHybridKeyPairText("base64")

  expect(keyPair.format).toBe("base64")
  expect(keyPair.publicKey.includes("\n")).toBe(false)
  expect(keyPair.privateKey.includes("\n")).toBe(false)
})

test("generateHybridKeyPairText serializes JWK keys", async () => {
  const keyPair = await generateHybridKeyPairText("jwk")

  expect(keyPair.format).toBe("jwk")
  expect(JSON.parse(keyPair.publicKey).kty).toBe("RSA")
  expect(JSON.parse(keyPair.privateKey).kty).toBe("RSA")
})

test("parseCliFormat reads supported flag and positional formats", () => {
  expect(parseCliFormat([])).toBe("pem")
  expect(parseCliFormat(["base64"])).toBe("base64")
  expect(parseCliFormat(["--format", "jwk"])).toBe("jwk")
  expect(parseCliFormat(["-f", "pem"])).toBe("pem")
})

test("parseCliFormat rejects unsupported formats", () => {
  try {
    parseCliFormat(["bogus"])
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid format. Use pem, base64, or jwk")
  }
})

test("publicKeyFromText and privateKeyFromText import PEM keys", async () => {
  const { privateKeyPem: privateKeyText, publicKeyPem: publicKeyText } =
    await getHybridKeyPairFixture()
  const importedPublicKey = await publicKeyFromText(publicKeyText)
  const importedPrivateKey = await privateKeyFromText(privateKeyText)

  expect(importedPublicKey.type).toBe("public")
  expect(importedPrivateKey.type).toBe("private")
})

test("publicKeyFromText and privateKeyFromText import base64 keys", async () => {
  const { privateKeyBase64: privateKeyText, publicKeyBase64: publicKeyText } =
    await getHybridKeyPairFixture()
  const importedPublicKey = await publicKeyFromText(publicKeyText)
  const importedPrivateKey = await privateKeyFromText(privateKeyText)

  expect(importedPublicKey.type).toBe("public")
  expect(importedPrivateKey.type).toBe("private")
})

test("publicKeyFromText and privateKeyFromText import JWK text", async () => {
  const { privateKeyJwkText: privateKeyText, publicKeyJwkText: publicKeyText } =
    await getHybridKeyPairFixture()
  const importedPublicKey = await publicKeyFromText(publicKeyText)
  const importedPrivateKey = await privateKeyFromText(privateKeyText)

  expect(importedPublicKey.type).toBe("public")
  expect(importedPrivateKey.type).toBe("private")
})

test("publicKeyFromText and privateKeyFromText reject malformed PEM text", async () => {
  try {
    await publicKeyFromText("-----BEGIN PUBLIC KEY-----bad")
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid PEM format")
  }

  try {
    await privateKeyFromText("-----BEGIN PRIVATE KEY-----bad")
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid PEM format")
  }
})
