import { expect, test } from "bun:test"
import { generateHybridKeyPair, privateKeyToText, publicKeyToText } from "./hybridKeyPair.ts"
import { rsaCrypt } from "./rsaCrypt.ts"
import { rsaDecrypt } from "./rsaDecrypt.ts"

let rsaFixturePromise:
  | Promise<{ privateKey: CryptoKey; privateKeyText: string; publicKey: CryptoKey; publicKeyText: string }>
  | undefined

function getRsaFixture() {
  rsaFixturePromise ??= (async () => {
    const { publicKey, privateKey } = await generateHybridKeyPair()
    return {
      privateKey,
      privateKeyText: await privateKeyToText(privateKey),
      publicKey,
      publicKeyText: await publicKeyToText(publicKey),
    }
  })()

  return rsaFixturePromise
}

test("rsaCrypt encrypts strings and objects", async () => {
  const { privateKey, publicKey } = await getRsaFixture()

  expect(await rsaDecrypt(await rsaCrypt("hello", publicKey), privateKey)).toBe("hello")
  expect(await rsaDecrypt(await rsaCrypt({ hello: "world" }, publicKey), privateKey)).toBe(
    '{"hello":"world"}',
  )
})

test("rsaCrypt works with text keys", async () => {
  const { privateKeyText, publicKeyText } = await getRsaFixture()
  const token = await rsaCrypt("hello", publicKeyText)

  expect(await rsaDecrypt(token, privateKeyText)).toBe("hello")
})
