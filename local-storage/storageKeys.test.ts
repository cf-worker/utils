import { expect, test } from "bun:test"
import { storageKeys } from "./storageKeys.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

test("storageKeys", () => {
  globalThis.localStorage ??= new MemoryStorage()
  globalThis.localStorage.clear()
  expect(storageKeys()).toEqual([])
  localStorage.setItem("foo", "bar")
  expect(storageKeys()).toEqual(["foo"])
  globalThis.localStorage.clear()
})
