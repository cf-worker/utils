import { expect, test } from "bun:test"
import { isEmail } from "./isEmail.ts"

test("isEmail should return true for valid email addresses", () => {
  expect(isEmail("test@example.com")).toBe(true)
  expect(isEmail("john.doe@example.co.uk")).toBe(true)
  expect(isEmail("jane.doe123@example123.com")).toBe(true)
})

test("isEmail should return false for invalid email addresses", () => {
  expect(isEmail("notanemail")).toBe(false)
  expect(isEmail("test@example")).toBe(false)
  expect(isEmail("test@example..com")).toBe(false)
  expect(isEmail("test@.example.com")).toBe(false)
  expect(isEmail("test@example_com")).toBe(false)
})

test("isEmail should return false for email addresses longer than 320 characters", () => {
  const longEmail = "a".repeat(309) + "@example.com"
  expect(isEmail(longEmail)).toBe(false)
})

test("should recognize valid email addresses", () => {
  expect(isEmail("team@segment.io")).toBe(true)
  expect(isEmail("team+@segmentio.com")).toBe(true)
  expect(isEmail("te-am@segmentio.com")).toBe(true)
  expect(isEmail("team@segmen-tio.com")).toBe(true)
  expect(isEmail("t-eam+34@segme-ntio.com")).toBe(true)
})

test("should recognize invalid email addresses", () => {
  expect(isEmail("team@.org")).toBe(false)
  expect(isEmail("team+45.io")).toBe(false)
  expect(isEmail("@segmentio.com")).toBe(false)
})
