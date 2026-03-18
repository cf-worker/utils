import process from "node:process"

/** Returns CLI args for the current runtime. */
export function args(): string[] {
  if ("Deno" in globalThis) return Deno.args
  return process.argv.slice(2)
}
