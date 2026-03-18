import { expect, test } from "bun:test"
import { base64Encode } from "../encoding/base64Encode.ts"
import { hybridDecrypt } from "./hybridDecrypt.ts"
import { hybridEncrypt } from "./hybridEncrypt.ts"
import { generateHybridKeyPair, privateKeyToText } from "./hybridKeyPair.ts"

let hybridFixturePromise:
  | Promise<{ privateKey: CryptoKey, privateKeyText: string, publicKey: CryptoKey }>
  | undefined

function getHybridFixture() {
  hybridFixturePromise ??= (async () => {
    const keyPair = await generateHybridKeyPair()
    return {
      privateKey: keyPair.privateKey,
      privateKeyText: await privateKeyToText(keyPair.privateKey),
      publicKey: keyPair.publicKey,
    }
  })()

  return hybridFixturePromise
}

test("hybridDecrypt restores plaintext from a hybrid token", async () => {
  const { publicKey, privateKey } = await getHybridFixture()
  const token = await hybridEncrypt("secret value", publicKey)

  expect(await hybridDecrypt(token, privateKey)).toBe("secret value")
})

test("hybridDecrypt works with a PEM private key", async () => {
  const { privateKeyText, publicKey } = await getHybridFixture()
  const token = await hybridEncrypt("secret value", publicKey)

  expect(await hybridDecrypt(token, privateKeyText)).toBe("secret value")
})

test("hybridDecrypt throws for malformed token format", async () => {
  const { privateKeyText } = await getHybridFixture()

  try {
    await hybridDecrypt("bad-token", privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for tokens shorter than the header", async () => {
  const { privateKeyText } = await getHybridFixture()

  try {
    await hybridDecrypt(base64Encode(new Uint8Array([1, 2, 3])), privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for invalid token header values", async () => {
  const { privateKeyText } = await getHybridFixture()

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
  const { privateKeyText } = await getHybridFixture()

  try {
    await hybridDecrypt(base64Encode(new Uint8Array([1, 0, 1, 1, 255])), privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws when using the wrong private key", async () => {
  const [{ publicKey }, { privateKey }] = await Promise.all([getHybridFixture(), generateHybridKeyPair()])
  const token = await hybridEncrypt("secret value", publicKey)

  try {
    await hybridDecrypt(token, privateKey)
    expect(true).toBe(false)
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
