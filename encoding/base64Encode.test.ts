import { expect, test } from "bun:test"
import { base64Encode } from "./base64Encode.ts"

test("base64Encode", () => {
  const expected = "yPe8teZndCCeDpATBNgsYgdMdbriaTOh1Vz8ruuk89Q"
  // deno-fmt-ignore
  const array = [ 200, 247, 188, 181, 230, 103, 116, 32, 158, 14, 144, 19, 4, 216, 44, 98, 7, 76, 117, 186, 226, 105, 51, 161, 213, 92, 252, 174, 235, 164, 243, 212]
  const uint8Array = new Uint8Array(array)
  let base64 = base64Encode(uint8Array)
  expect(base64).toEqual(expected)

  base64 = base64Encode(uint8Array)
  expect(base64).toEqual(expected)
})
