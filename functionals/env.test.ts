import { expect, test } from "bun:test"
import { env } from "./env.ts"

test("env", () => {
  expect(() => env("DOES_NOT_EXISTS")).toThrow()
  expect(typeof env("PWD")).toBe("string")
})
