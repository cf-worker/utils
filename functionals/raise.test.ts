import { expect, test } from "bun:test"
import { raise } from "./raise.ts"

test("raise should throw an error", () => {
  expect(() => raise("error")).toThrow("error")
  // this code is invalid
  // assertThrows(() => throw "error")
  // valid code
  // assertThrows(() => { throw "error" })
})
