import { raise } from "./raise.ts"

/**
 * Return value from env or throws error
 * @param key
 * @param defaultValue
 * @returns
 */
export function env(key: string, defaultValue?: string): string {
  return (
    // deno-lint-ignore no-process-global
    process.env[key] ??
      defaultValue ??
      raise(new ReferenceError(`Missing required env "${key}"`, { cause: key }))
  )
}
