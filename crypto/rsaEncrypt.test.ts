import { expect, test } from "bun:test"
import { getRsaTestFixture } from "./hybridTestFixtures.fixture.ts"
import { rsaEncrypt } from "./rsaEncrypt.ts"
import { rsaDecrypt } from "./rsaDecrypt.ts"

test("rsaEncrypt encrypts strings and objects", async () => {
  const { helloToken, objectToken, privateKey } = await getRsaTestFixture()
  expect(await rsaDecrypt(helloToken, privateKey)).toBe("hello")
  expect(await rsaDecrypt(objectToken, privateKey)).toBe('{"hello":"world"}')
})

test("rsaEncrypt works with text keys", async () => {
  const { privateKeyText, publicKeyText } = await getRsaTestFixture()
  const token = await rsaEncrypt("hello", publicKeyText)

  expect(await rsaDecrypt(token, privateKeyText)).toBe("hello")
})
