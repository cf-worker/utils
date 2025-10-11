import { safeJson } from "../json/safeJson.ts"
import { storageKeys } from "./storageKeys.ts"

/**
 * Storage as json object Record<string, unknown>
 * @param storage
 * @returns
 */
export function storage2json(storage: Storage = localStorage): Record<string, unknown> {
  return Object.fromEntries(
    storageKeys(storage).map((key) => {
      const item = storage.getItem(key)
      let value: unknown
      if (item !== null) value = safeJson(item)
      if (value === undefined) value = item

      return [
        key,
        value,
      ]
    }),
  )
}
