import { expect, test } from "bun:test"
import { stringByteLength } from "./stringByteLength.ts"

test("stringByteLength should return the correct byte length for an empty string", () => {
  expect(stringByteLength("")).toBe(0)
})

test("stringByteLength should return the correct byte length for a string with ASCII characters", () => {
  expect(stringByteLength("Hello, World!")).toBe(13)
})

test("stringByteLength should return the correct byte length for a string with non-ASCII characters", () => {
  expect(stringByteLength("你好，世界！")).toBe(18)
})

test("stringByteLength should return the correct byte length for an emoji", () => {
  expect(stringByteLength("😀")).toBe(4)
})
