import { expect, test } from "bun:test"
import { base64Decode } from "./base64Decode.ts"

test("base64Decode", () => {
  const base64 = "yPe8teZndCCeDpATBNgsYgdMdbriaTOh1Vz8ruuk89Q"
  const uint8Array = base64Decode(base64)
  // deno-fmt-ignore
  const expected = new Uint8Array([ 200, 247, 188, 181, 230, 103, 116, 32, 158, 14, 144, 19, 4, 216, 44, 98, 7, 76, 117, 186, 226, 105, 51, 161, 213, 92, 252, 174, 235, 164, 243, 212])
  expect(uint8Array).toEqual(expected)
})
