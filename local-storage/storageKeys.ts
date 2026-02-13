/**
 * local-storage/storageKeys module.
 * @module
 */
/**
 * Returns the keys from (local|session)Storage
 * @param storage
 * @returns
 */
export function storageKeys(storage: Storage = localStorage): string[] {
  return new Array(storage.length).fill(0).map((_, i) => String(storage.key(i)))
}
