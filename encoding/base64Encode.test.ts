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

test("base64Encode supports ArrayBuffer input", () => {
  const bytes = new Uint8Array([65, 66, 67])

  expect(base64Encode(bytes.buffer)).toBe("QUJD")
})

test("base64Encode preserves offsets for subarray views", () => {
  const bytes = new Uint8Array([88, 65, 66, 67, 89])
  const view = bytes.subarray(1, 4)

  expect(base64Encode(view)).toBe("QUJD")
})

test("base64Encode supports non-Uint8 ArrayBufferView input", () => {
  const view = new Uint16Array([65, 66, 67])

  expect(base64Encode(view)).toBe("QQBCAEMA")
})
