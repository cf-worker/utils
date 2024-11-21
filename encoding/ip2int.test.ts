import { expect, test } from "bun:test"
import { ip2int } from "./ip2int.ts"

test("converts a valid IP address to a 32-bit integer", () => {
  const input = "127.0.0.1"
  const expectedOutput = 2130706433
  expect(ip2int(input)).toBe(expectedOutput)
})

test("handles IP addresses with multiple non-zero octets", () => {
  const input = "192.168.1.1"
  const expectedOutput = 3232235777
  expect(ip2int(input)).toBe(expectedOutput)
})

test("handles IP addresses with leading zeros", () => {
  const input = "1.0.0.0"
  const expectedOutput = 16777216
  expect(ip2int(input)).toBe(expectedOutput)
})

test("handles IP addresses with trailing zeros", () => {
  const input = "255.255.255.255"
  const expectedOutput = 4294967295
  expect(ip2int(input)).toBe(expectedOutput)
})
