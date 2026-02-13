/**
 * functionals/env module.
 * @module
 */
import { raise } from "./raise.ts"

/**
 * Return value from env or throws error
 * Cloudflare Workers supports process.env:
 * https://developers.cloudflare.com/changelog/2025-03-11-process-env-support/
 * https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global
 *
 * @param key
 * @param defaultValue
 * @returns
 */
export function env(key: string, defaultValue?: string): string {
  // deno-lint-ignore no-explicit-any
  const global: any = globalThis
  return (
    global.process.env[key] ??
      defaultValue ??
      raise(new ReferenceError(`Missing required env "${key}"`, { cause: key }))
  )
}
