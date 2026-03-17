// avoid import @types/bun that conflicts with Deno
declare const Bun: {
  stdin: {
    text(): Promise<string>
  }
}

/** Reads trimmed text from Bun standard input. */
export async function stdinBun(): Promise<string> {
  return (await Bun.stdin.text()).trim()
}
