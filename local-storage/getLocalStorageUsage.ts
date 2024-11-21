import { stringByteLength } from "../strings/stringByteLength.ts"

/**
 * Calculates the total size of the items stored in the local storage.
 *
 * @param storage - The storage object to calculate the size for. Defaults to `localStorage`.
 * @returns The total size of the items stored in the local storage.
 * @abstract Also works with objects
 * @see https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
 */
export function getLocalStorageUsage(
  storage: Record<string, string | null | undefined> = globalThis.localStorage,
): number {
  return Object.keys(storage)
    .map((key) => `${key}${storage[key]}`)
    .reduce((sum, value) => sum + stringByteLength(value), 0)
}
