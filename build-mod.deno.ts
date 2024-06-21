import { walkSync } from "@std/fs"
import { tap } from "./mod.ts"

/**
 * Script to iterate in all folders, and build the mod.ts file, importing all files in that folder,
 * except test files and mod.ts itself, and export them in alphabetical order.
 */
function buildMod(dir: string) {
  const code = Array.from(
    walkSync(dir, { maxDepth: 1, includeDirs: false, exts: [".ts"], skip: [/\.test\.ts/, /mod\.ts/] }),
  )
    .map((entry) => entry.name)
    .sort()
    .map((file) => `export * from "./${file}"\n`)
    .join("")
  if (code) {
    Deno.writeTextFileSync(`${dir}/mod.ts`, code)
    return true
  }
  return false
}

const code = Array.from(
  walkSync(".", { maxDepth: 1, includeDirs: true, includeFiles: false, skip: [/\..+/], match: [/\w+/] }),
)
  .map((entry) => entry.name)
  .filter(buildMod)
  .sort()
  .map((file) => `export * from "./${file}/mod.ts"\n`)
  .join("")

Deno.writeTextFileSync("./mod.ts", `${code}export type * from "./types.ts"\n`)
