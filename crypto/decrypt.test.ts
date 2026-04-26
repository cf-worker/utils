import { expect, test } from "bun:test"
import { crypt } from "./crypt.ts"
import { decrypt } from "./decrypt.ts"

test("decrypt restores strings and serialized objects", async () => {
  expect(await decrypt(await crypt("hello", "secret"), "secret")).toBe("hello")
  expect(await decrypt(await crypt({ hello: "world" }, "secret"), "secret")).toBe(
    '{"hello":"world"}',
  )
})

test("decrypt throws for the wrong key", async () => {
  try {
    await decrypt(await crypt("hello", "secret"), "nope")
    throw new Error("Expected decrypt to throw")
  } catch (error) {
    expect(error instanceof Error).toBe(true)
  }
})
