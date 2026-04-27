import { expect, test } from "bun:test"
import { getRsaTestFixture } from "./hybridTestFixtures.ts"
import { rsaCrypt } from "./rsaCrypt.ts"
import { rsaDecrypt } from "./rsaDecrypt.ts"

test("rsaCrypt encrypts strings and objects", async () => {
  const { helloToken, objectToken, privateKey } = await getRsaTestFixture()
  expect(await rsaDecrypt(helloToken, privateKey)).toBe("hello")
  expect(await rsaDecrypt(objectToken, privateKey)).toBe('{"hello":"world"}')
})

test("rsaCrypt works with text keys", async () => {
  const { privateKeyText, publicKeyText } = await getRsaTestFixture()
  const token = await rsaCrypt("hello", publicKeyText)

  expect(await rsaDecrypt(token, privateKeyText)).toBe("hello")
})
