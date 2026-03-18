import { expect, test } from "bun:test"
import { hybridDecrypt } from "./hybridDecrypt.ts"
import { hybridEncrypt } from "./hybridEncrypt.ts"
import { generateHybridKeyPair, publicKeyToText } from "./hybridKeyPair.ts"

let hybridFixturePromise:
  | Promise<{ privateKey: CryptoKey, publicKey: CryptoKey, publicKeyText: string }>
  | undefined

function getHybridFixture() {
  hybridFixturePromise ??= (async () => {
    const { publicKey, privateKey } = await generateHybridKeyPair()
    return {
      privateKey,
      publicKey,
      publicKeyText: await publicKeyToText(publicKey),
    }
  })()

  return hybridFixturePromise
}

test("hybridEncrypt returns a compact token", async () => {
  const { publicKey } = await getHybridFixture()
  const token = await hybridEncrypt("hello world", publicKey)

  expect(typeof token).toBe("string")
  expect(token.length > 0).toBe(true)
  expect(token.includes(".")).toBe(false)
})

test("hybridEncrypt works with a PEM public key", async () => {
  const { privateKey, publicKeyText } = await getHybridFixture()
  const token = await hybridEncrypt("hello world", publicKeyText)

  expect(await hybridDecrypt(token, privateKey)).toBe("hello world")
})

test("hybridEncrypt serializes objects before encryption", async () => {
  const { publicKey, privateKey } = await getHybridFixture()
  const token = await hybridEncrypt({ hello: "world", count: 1 }, publicKey)

  expect(await hybridDecrypt(token, privateKey)).toBe('{"hello":"world","count":1}')
})
