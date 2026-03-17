import { expect, test } from "bun:test"
import { deobfuscate } from "./deobfuscate.ts"
import { obfuscate } from "./obfuscate.ts"

test("deobfuscate restores the plaintext from an obfuscated token", async () => {
  const token = await obfuscate("secret value")

  expect(await deobfuscate(token)).toBe("secret value")
})

test("deobfuscate throws for malformed token format", async () => {
  try {
    await deobfuscate("invalid-token")
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid token format")
  }
})

test("deobfuscate throws for payloads shorter than key plus iv", async () => {
  const shortPayload = btoa("short").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  const privateKey = btoa("key").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  try {
    await deobfuscate(`${shortPayload}.${privateKey}`)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid encrypted payload")
  }
})
