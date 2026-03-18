import { expect, test } from "bun:test"
import { deobfuscate } from "./deobfuscate.ts"
import { generateObfuscationKeyPair, obfuscate } from "./obfuscate.ts"

let obfuscationFixturePromise: Promise<{ keyPair: CryptoKeyPair, privateKeyText: string }> | undefined

function getObfuscationFixture() {
  obfuscationFixturePromise ??= (async () => {
    const keyPair = await generateObfuscationKeyPair()
    const seedToken = await obfuscate("seed", { keyPair })
    const [, privateKeyText] = seedToken.split(".")
    return { keyPair, privateKeyText }
  })()

  return obfuscationFixturePromise
}

test("obfuscate returns a token with two parts", async () => {
  const token = await obfuscate("hello world")
  const parts = token.split(".")

  expect(parts.length).toBe(2)
  expect(parts[0].length > 0).toBe(true)
  expect(parts[1].length > 0).toBe(true)
})

test("obfuscate output can be deobfuscated back to the original string", async () => {
  const token = await obfuscate("hello world")

  expect(await deobfuscate(token)).toBe("hello world")
})

test("obfuscate serializes objects before obfuscation", async () => {
  const token = await obfuscate({ hello: "world", count: 1 })

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
