import { stdinBun } from "./stdinBun.ts"
import { stdinDeno } from "./stdinDeno.ts"
import { stdinNode } from "./stdinNode.ts"

/** Reads trimmed text from standard input in the current runtime. */
export function stdin(): Promise<string> {
  if ("Bun" in globalThis) return stdinBun()
  if ("Deno" in globalThis) return stdinDeno()
  return stdinNode()
}
