import { expect, test } from "bun:test"
import {
  generateHybridKeyPair,
  privateKeyFromText,
  privateKeyToBase64,
  privateKeyToJwkText,
  privateKeyToPem,
  privateKeyToText,
  publicKeyFromText,
  publicKeyToBase64,
  publicKeyToJwkText,
  publicKeyToPem,
  publicKeyToText,
} from "./hybridKeyPair.ts"

test("generateHybridKeyPair returns usable RSA keys", async () => {
  const { privateKey, publicKey } = await generateHybridKeyPair()

  expect(privateKey.type).toBe("private")
  expect(publicKey.type).toBe("public")
})

test("publicKeyToText and privateKeyToText return PEM text", async () => {
  const { privateKey, publicKey } = await generateHybridKeyPair()
  const publicKeyText = await publicKeyToText(publicKey)
  const privateKeyText = await privateKeyToText(privateKey)

  expect(publicKeyText.startsWith("-----BEGIN PUBLIC KEY-----")).toBe(true)
  expect(privateKeyText.startsWith("-----BEGIN PRIVATE KEY-----")).toBe(true)
})

test("publicKeyFromText and privateKeyFromText import PEM keys", async () => {
  const { privateKey, publicKey } = await generateHybridKeyPair()
  const publicKeyText = await publicKeyToPem(publicKey)
  const privateKeyText = await privateKeyToPem(privateKey)
  const importedPublicKey = await publicKeyFromText(publicKeyText)
  const importedPrivateKey = await privateKeyFromText(privateKeyText)

  expect(importedPublicKey.type).toBe("public")
  expect(importedPrivateKey.type).toBe("private")
})

test("publicKeyFromText and privateKeyFromText import base64 keys", async () => {
  const { privateKey, publicKey } = await generateHybridKeyPair()
  const publicKeyText = await publicKeyToBase64(publicKey)
  const privateKeyText = await privateKeyToBase64(privateKey)
  const importedPublicKey = await publicKeyFromText(publicKeyText)
  const importedPrivateKey = await privateKeyFromText(privateKeyText)

  expect(importedPublicKey.type).toBe("public")
  expect(importedPrivateKey.type).toBe("private")
})

test("publicKeyFromText and privateKeyFromText import JWK text", async () => {
  const { privateKey, publicKey } = await generateHybridKeyPair()
  const publicKeyText = await publicKeyToJwkText(publicKey)
  const privateKeyText = await privateKeyToJwkText(privateKey)
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
