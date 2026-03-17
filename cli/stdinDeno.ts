/** Reads trimmed text from Deno standard input. */
export async function stdinDeno(): Promise<string> {
  return (await new Response(Deno.stdin.readable).text()).trim()
}
