import { expect, test } from "bun:test"
import { envPoly } from "./envPoly.ts"

test("envPoly", () => {
  expect(envPoly("DOES_NOT_EXISTS")).toBeUndefined()
  expect(typeof envPoly("PWD")).toBe("string")
})
