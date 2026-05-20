import { expect, test } from "bun:test"
import { base64Encode } from "../encoding/base64Encode.ts"
import { getHybridTestFixture } from "./hybridTestFixtures.fixture.ts"
import { hybridDecrypt } from "./hybridDecrypt.ts"

test("hybridDecrypt restores plaintext from a hybrid token", async () => {
  const { helloToken: token, privateKey } = await getHybridTestFixture()
  expect(await hybridDecrypt(token, privateKey)).toBe("hello world")
})

test("hybridDecrypt works with a PEM private key", async () => {
  const { helloToken: token, privateKeyText } = await getHybridTestFixture()
  expect(await hybridDecrypt(token, privateKeyText)).toBe("hello world")
})

test("hybridDecrypt throws for malformed token format", async () => {
  const { privateKeyText } = await getHybridTestFixture()

  try {
    await hybridDecrypt("bad-token", privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for tokens shorter than the header", async () => {
  const { privateKeyText } = await getHybridTestFixture()

  try {
    await hybridDecrypt(base64Encode(new Uint8Array([1, 2, 3])), privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws for invalid token header values", async () => {
  const { privateKeyText } = await getHybridTestFixture()

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
  const { privateKeyText } = await getHybridTestFixture()

  try {
    await hybridDecrypt(base64Encode(new Uint8Array([1, 0, 1, 1, 255])), privateKeyText)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid hybrid token")
  }
})

test("hybridDecrypt throws when using the wrong private key", async () => {
  const { helloToken: token, wrongPrivateKey } = await getHybridTestFixture()

  try {
    await hybridDecrypt(token, wrongPrivateKey)
    expect(true).toBe(false)
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
