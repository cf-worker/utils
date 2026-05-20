import { stdinBun } from "./stdinBun.ts"
import { stdinDeno } from "./stdinDeno.ts"
import { stdinNode } from "./stdinNode.ts"

type StdinRuntime = {
  Bun?: unknown
  Deno?: unknown
}

type StdinReaders = {
  bun: () => Promise<string>
  deno: () => Promise<string>
  node: () => Promise<string>
}

const defaultReaders: StdinReaders = {
  bun: stdinBun,
  deno: stdinDeno,
  node: stdinNode,
}

/** Reads trimmed text from standard input in the current runtime. */
export function stdin(
  runtime: StdinRuntime = globalThis,
  readers: StdinReaders = defaultReaders,
): Promise<string> {
  if ("Bun" in runtime) return readers.bun()
  if ("Deno" in runtime) return readers.deno()
  return readers.node()
}
