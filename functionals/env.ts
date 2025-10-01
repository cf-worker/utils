import { envPoly } from "./envPoly.ts"
import { raise } from "./raise.ts"

/**
 * Return value from env or throws error
 * @param key
 * @param defaultValue
 * @returns
 */
export function env(key: string, defaultValue?: string): string {
  return (
    envPoly(key) ??
      defaultValue ??
      raise(new ReferenceError(`Missing required env "${key}"`, { cause: key }))
  )
}
