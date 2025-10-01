/**
 * Polyfill for env across Deno, Bun and Node
 * @param key
 * @returns
 */
export function envPoly(key: string): string | undefined {
  // deno-lint-ignore no-explicit-any
  const global: any = globalThis
  if ("Deno" in globalThis) return global.Deno.env.get(key)
  if ("Bun" in globalThis) return global.Bun.env[key]
  if ("process" in globalThis) return global.process.env[key]
}
