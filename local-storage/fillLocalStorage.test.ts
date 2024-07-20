import { expect, test } from "bun:test"
import { fillLocalStorage } from "./fillLocalStorage.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

test("fillLocalStorage", () => {
  const limit = 6 // use 6 to force create the key " " and ""
  const storage = new MemoryStorage({ limit })
  storage.clear()
  storage.setItem("a", "a")
  expect(fillLocalStorage({ storage })).toBe(limit - 2)
  // should clear all used keys
  expect(storage.length).toBe(1)
})
