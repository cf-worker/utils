import { assertThrows } from "@std/assert"
import { raise } from "./raise.ts"

Deno.test("raise should throw an error", () => {
  assertThrows(() => raise("error"))
  // this code is invalid
  // assertThrows(() => throw "error")
  // valid code
  // assertThrows(() => { throw "error" })
})
