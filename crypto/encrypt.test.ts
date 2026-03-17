import { expect, test } from "bun:test"
import { encrypt } from "./encrypt.ts"
import { decrypt } from "./decrypt.ts"

test("encrypt returns an encrypted token with two parts", async () => {
  const token = await encrypt("hello world")
  const parts = token.split(".")

  expect(parts.length).toBe(2)
  expect(parts[0].length > 0).toBe(true)
  expect(parts[1].length > 0).toBe(true)
})

test("encrypt output can be decrypted back to the original string", async () => {
  const token = await encrypt("hello world")

  expect(await decrypt(token)).toBe("hello world")
})

test("encrypt serializes objects before encryption", async () => {
  const token = await encrypt({ hello: "world", count: 1 })

  expect(await decrypt(token)).toBe('{"hello":"world","count":1}')
})
