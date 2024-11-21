import { expect, test } from "bun:test"
import { int2ip } from "./int2ip.ts"

test("converts a 32-bit integer to a valid IP address", () => {
  const input = 2130706433 // 127.0.0.1 in decimal
  const expectedOutput = "127.0.0.1"
  expect(int2ip(input)).toBe(expectedOutput)
})

test("handles IP addresses with multiple non-zero octets", () => {
  const input = 3232235777 // 192.168.1.1 in decimal
  const expectedOutput = "192.168.1.1"
  expect(int2ip(input)).toBe(expectedOutput)
})

test("handles IP addresses with leading zeros", () => {
  const input = 16777216 // 1.0.0.0 in decimal
  const expectedOutput = "1.0.0.0"
  expect(int2ip(input)).toBe(expectedOutput)
})

test("handles IP addresses with trailing zeros", () => {
  const input = 4294967295 // 255.255.255.255 in decimal
  const expectedOutput = "255.255.255.255"
  expect(int2ip(input)).toBe(expectedOutput)
})
