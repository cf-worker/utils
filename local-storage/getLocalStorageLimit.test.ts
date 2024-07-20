import { expect, test } from "bun:test"
import { getLocalStorageLimit } from "./getLocalStorageLimit.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

// https://tinyurl.com/deno-localstorage-limit
// including the key length and considering multiple bytes per character like emojis
const DENO_LOCAL_STORAGE_LIMIT = 10_485_760 // 1024 * 1024 * 10

test("getLocalStorageLimit should return the maximum number of characters that can be stored in local storage", () => {
  const storage = new MemoryStorage({ limit: DENO_LOCAL_STORAGE_LIMIT })
  storage.clear()
  storage.setItem("a", "a")
  expect(getLocalStorageLimit(storage)).toEqual(DENO_LOCAL_STORAGE_LIMIT)
})
