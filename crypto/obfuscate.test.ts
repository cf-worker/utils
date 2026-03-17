import { expect, test } from "bun:test"
import { deobfuscate } from "./deobfuscate.ts"
import { obfuscate } from "./obfuscate.ts"

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
