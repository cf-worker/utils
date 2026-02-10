import { expect, test } from "bun:test"
import { storageKeys } from "./storageKeys.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

test("storageKeys", () => {
  const storage = new MemoryStorage()
  storage.clear()
  expect(storageKeys(storage)).toEqual([])
  storage.setItem("foo", "bar")
  expect(storageKeys(storage)).toEqual(["foo"])
})
