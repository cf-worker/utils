import { expect, test } from "bun:test"
import { generateHybridKeyPair } from "./hybridKeyPair.ts"
import { rsaCrypt } from "./rsaCrypt.ts"
import { rsaDecrypt } from "./rsaDecrypt.ts"

test("rsaDecrypt throws with the wrong private key", async () => {
  const [{ publicKey }, { privateKey }] = await Promise.all([
    generateHybridKeyPair(),
    generateHybridKeyPair(),
  ])
  const token = await rsaCrypt("hello", publicKey)

  try {
    await rsaDecrypt(token, privateKey)
    throw new Error("Expected rsaDecrypt to throw")
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
