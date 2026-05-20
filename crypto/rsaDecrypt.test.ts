import { expect, test } from "bun:test"
import { getRsaTestFixture } from "./hybridTestFixtures.fixture.ts"
import { rsaDecrypt } from "./rsaDecrypt.ts"

test("rsaDecrypt throws with the wrong private key", async () => {
  const { helloToken: token, wrongPrivateKey } = await getRsaTestFixture()

  try {
    await rsaDecrypt(token, wrongPrivateKey)
    throw new Error("Expected rsaDecrypt to throw")
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
