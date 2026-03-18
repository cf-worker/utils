import { expect, test } from "bun:test"
import { base64Encode } from "../encoding/base64Encode.ts"
import { hybridDecrypt } from "./hybridDecrypt.ts"
import { hybridEncrypt } from "./hybridEncrypt.ts"
import { generateHybridKeyPair, privateKeyToText } from "./hybridKeyPair.ts"

test("hybridDecrypt restores plaintext from a hybrid token", async () => {
  const { publicKey, privateKey } = await generateHybridKeyPair()
  const token = await hybridEncrypt("secret value", publicKey)

  expect(await hybridDecrypt(token, privateKey)).toBe("secret value")
})

test("hybridDecrypt works with a PEM private key", async () => {
  const { publicKey, privateKey } = await generateHybridKeyPair()
  const privateKeyText = await privateKeyToText(privateKey)
  const token = await hybridEncrypt("secret value", publicKey)

  expect(await hybridDecrypt(token, privateKeyText)).toBe("secret value")
})

test("hybridDecrypt throws for malformed token format", async () => {
  try {
    await hybridDecrypt(
      "bad-token",
      await privateKeyToText((await generateHybridKeyPair()).privateKey),
    )
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for tokens shorter than the header", async () => {
  try {
    await hybridDecrypt(
      base64Encode(new Uint8Array([1, 2, 3])),
      await privateKeyToText((await generateHybridKeyPair()).privateKey),
    )
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for invalid token header values", async () => {
  const privateKeyText = await privateKeyToText((await generateHybridKeyPair()).privateKey)

  for (
    const payload of [
      new Uint8Array([0, 1, 0, 12, 1, 2, 3, 4]),
      new Uint8Array([1, 0, 0, 12, 1, 2, 3, 4]),
      new Uint8Array([1, 1, 0, 0, 1, 2, 3, 4]),
    ]
  ) {
    try {
      await hybridDecrypt(base64Encode(payload), privateKeyText)
      expect(true).toBe(false)
    } catch (error) {
      expect((error as Error).message).toBe("Invalid hybrid token")
    }
  }
})

test("hybridDecrypt throws for truncated tokens", async () => {
  const privateKeyText = await privateKeyToText((await generateHybridKeyPair()).privateKey)

  try {
    await hybridDecrypt(base64Encode(new Uint8Array([1, 0, 1, 1, 255])), privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws when using the wrong private key", async () => {
  const [{ publicKey }, { privateKey }] = await Promise.all([
    generateHybridKeyPair(),
    generateHybridKeyPair(),
  ])
  const token = await hybridEncrypt("secret value", publicKey)

  try {
    await hybridDecrypt(token, privateKey)
    expect(true).toBe(false)
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
