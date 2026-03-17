/** Reads trimmed text from Node standard input. */
export async function stdinNode(): Promise<string> {
  const { text } = await import("node:stream/consumers")
  return (await text(globalThis.process.stdin)).trim()
}
