import process from "node:process"

/** Sets the process exit code for the current runtime without forcing an abrupt exit. */
export function setExitCode(code: number): void {
  if ("Deno" in globalThis) {
    Deno.exitCode = code
    return
  }
  process.exitCode = code
}
