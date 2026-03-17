import { expect, test } from "bun:test"
import { decrypt } from "./decrypt.ts"
import { encrypt } from "./encrypt.ts"

test("decrypt restores the plaintext from an encrypted token", async () => {
  const token = await encrypt("secret value")

  expect(await decrypt(token)).toBe("secret value")
})

test("decrypt throws for malformed token format", async () => {
  try {
    await decrypt("invalid-token")
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid token format")
  }
})

test("decrypt throws for payloads shorter than key plus iv", async () => {
  const shortPayload = btoa("short").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  const privateKey = btoa("key").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  try {
    await decrypt(`${shortPayload}.${privateKey}`)
    expect(true).toBe(false)
  } catch (error) {
    expect((error as Error).message).toBe("Invalid encrypted payload")
  }
})
