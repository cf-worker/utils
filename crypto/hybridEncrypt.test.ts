import { expect, test } from "bun:test"
import { getHybridTestFixture } from "./hybridTestFixtures.ts"
import { hybridDecrypt } from "./hybridDecrypt.ts"

test("hybridEncrypt returns a compact token", async () => {
  const { helloToken: token } = await getHybridTestFixture()

  expect(typeof token).toBe("string")
  expect(token.length > 0).toBe(true)
  expect(token.includes(".")).toBe(false)
})

test("hybridEncrypt works with a PEM public key", async () => {
  const { helloTokenFromTextKey: token, privateKey } = await getHybridTestFixture()

  expect(await hybridDecrypt(token, privateKey)).toBe("hello world")
})

test("hybridEncrypt serializes objects before encryption", async () => {
  const { objectToken: token, privateKey } = await getHybridTestFixture()

  expect(await hybridDecrypt(token, privateKey)).toBe('{"hello":"world","count":1}')
})
