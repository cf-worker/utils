import { expect, test } from "bun:test"
import { deobfuscate } from "./deobfuscate.ts"
import { getObfuscationTestFixture } from "./hybridTestFixtures.ts"
import { obfuscate } from "./obfuscate.ts"

let obfuscationFixturePromise:
  | Promise<{ keyPair: CryptoKeyPair; privateKeyText: string; tokenWithKey: string }>
  | undefined

function getObfuscationFixture() {
  obfuscationFixturePromise ??= (async () => {
    const { helloTokenWithKey: tokenWithKey, keyPair, privateKeyText } =
      await getObfuscationTestFixture()
    return { keyPair, privateKeyText, tokenWithKey }
  })()

  return obfuscationFixturePromise
}

test("obfuscate returns a token with two parts", async () => {
  const { tokenWithKey: token } = await getObfuscationFixture()
  const parts = token.split(".")

  expect(parts.length).toBe(2)
  expect(parts[0].length > 0).toBe(true)
  expect(parts[1].length > 0).toBe(true)
})

test("obfuscate output can be deobfuscated back to the original string", async () => {
  const { tokenWithKey: token } = await getObfuscationFixture()

  expect(await deobfuscate(token)).toBe("hello world")
})

test("obfuscate can generate a key pair by default", async () => {
  const token = await obfuscate("generated key")

  expect(await deobfuscate(token)).toBe("generated key")
})

test("obfuscate serializes objects before obfuscation", async () => {
  const { keyPair } = await getObfuscationFixture()
  const token = await obfuscate({ hello: "world", count: 1 }, { keyPair })

  expect(await deobfuscate(token)).toBe('{"hello":"world","count":1}')
})

test("obfuscate can reuse a provided key pair without embedding the private key", async () => {
  const { keyPair } = await getObfuscationFixture()
  const token = await obfuscate("hello world", { keyPair, embedPrivateKey: false })

  expect(token.includes(".")).toBe(false)
  expect(await deobfuscate(token, keyPair.privateKey)).toBe("hello world")
})

test("obfuscate can reuse a pre-exported private key string", async () => {
  const { keyPair, privateKeyText } = await getObfuscationFixture()
  const secondToken = await obfuscate("second", { keyPair, privateKeyText })

  expect(await deobfuscate(secondToken)).toBe("second")
})
