import { expect, test } from "bun:test"
import { stringByteLength } from "../strings/stringByteLength.ts"
import { getLocalStorageUsage } from "./getLocalStorageUsage.ts"

function hashSize(storage: Record<string, string | null | undefined>): number {
  return Object.entries(storage).flat().map((o) => String(o)).map((s) => stringByteLength(s))
    .reduce((a, b) => a + b, 0)
}

test("getLocalStorageUsage should return 0 when local storage is empty", () => {
  const storage = {}
  const result = getLocalStorageUsage(storage)
  expect(result).toBe(0)
})

test("getLocalStorageUsage should return the correct size when local storage has items", () => {
  const storage = {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3",
  }
  const result = getLocalStorageUsage(storage)
  expect(result).toBe(hashSize(storage)) // Total size of "value1", "value2", and "value3" is 15
})

test("getLocalStorageUsage should handle null or undefined values in local storage", () => {
  const storage = {
    "key1": null, // null and undefined in localStorage are converted to "null"
    "key2": undefined, // and "undefined" respectively
    "key3": "value3",
  }
  const result = getLocalStorageUsage(storage)
  const expected = hashSize(storage)
  expect(result).toBe(expected)
})

test("getLocalStorageUsage should handle emoji", () => {
  const storage = {
    "key1": "😀",
  }
  const result = getLocalStorageUsage(storage)
  const expected = hashSize(storage)
  expect(result).toBe(expected)
})
