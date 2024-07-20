import { fillLocalStorage } from "./fillLocalStorage.ts"
import { getLocalStorageUsage } from "./getLocalStorageUsage.ts"

/**
 * Calculates the maximum number of characters that can be stored in the browser's local storage.
 *
 * @param clear - Optional parameter to clear the local storage before calculating the limit.
 * @returns The maximum number of characters that can be stored in the local storage.
 * Chrome: 5_242_880
 * localStorage.setItem(" ", "a".repeat(1024 * 1024 * 5 - 1)) => 5_242_879 + 1
 * Deno: 10_485_759
 * const DENO_LOCAL_STORAGE_LIMIT = 10_485_759 // 1024 * 1024 * 10 - 1
 * localStorage.clear()
 * const key = "a"
 * const keyLength = stringByteLength(key)
 * localStorage.setItem(key, "a".repeat(DENO_LOCAL_STORAGE_LIMIT - keyLength))
 */
export function getLocalStorageLimit(storage: Record<string, string> = globalThis.localStorage): number {
  return getLocalStorageUsage(storage) + fillLocalStorage({ storage })
}
