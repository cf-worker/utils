import { expect, test } from "bun:test"
import { decrypt } from "./decrypt.ts"
import { encrypt } from "./encrypt.ts"

test("decrypt restores the plaintext from an encrypted token", async () => {
  const token = await encrypt("secret value")

  expect(await decrypt(token)).toBe("secret value")
})
