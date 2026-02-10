import { walkSync } from "@std/fs"

type ModuleGroup = {
  dir: string
  files: string[]
}

/**
 * List all module files in a folder, excluding test/aggregator/internal files.
 */
function listModuleFiles(dir: string): string[] {
  return Array.from(
    walkSync(dir, {
      maxDepth: 1,
      includeDirs: false,
      exts: [".ts"],
      skip: [/\.d\.ts$/, /\.deno\.ts$/, /\.lab\.ts$/, /\.test\.ts$/, /mod\.ts$/],
    }),
  )
    .map((entry) => entry.name)
    .sort()
}

/**
 * Discover all top-level module folders and their module files.
 */
function listModuleGroups(): ModuleGroup[] {
  return Array.from(
    walkSync(".", {
      maxDepth: 1,
      includeDirs: true,
      includeFiles: false,
      skip: [/\..+/, /coverage/, /lab/, /node_modules/],
      match: [/\w+/],
    }),
  )
    .map((entry) => entry.name)
    .sort()
    .map((dir) => ({ dir, files: listModuleFiles(dir) }))
    .filter(({ files }) => files.length > 0)
}

/**
 * Build mod.ts files for each module folder.
 */
function buildFolderMod({ dir, files }: ModuleGroup) {
  const code = files.map((file) => `export * from "./${file}"\n`).join("")
  Deno.writeTextFileSync(`${dir}/mod.ts`, code)
}

/**
 * Build root mod.ts from all module folders.
 */
function buildRootMod(moduleGroups: ModuleGroup[]) {
  const code = moduleGroups
    .map(({ dir }) => `export * from "./${dir}/mod.ts"\n`)
    .join("")
  Deno.writeTextFileSync("./mod.ts", `${code}export type * from "./types.ts"\n`)
}

/**
 * Read a JSON file and return an empty object when the file does not exist.
 */
function readJsonFile(path: string): Record<string, unknown> {
  try {
    return JSON.parse(Deno.readTextFileSync(path)) as Record<string, unknown>
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return {}
    }
    throw error
  }
}

/**
 * Build the exports map with root and per-file module exports.
 * Ignore all *.mod.ts files except the root ./mod.ts entry.
 */
function buildExportsMap(moduleGroups: ModuleGroup[]): Record<string, string> {
  const exports: Array<[string, string]> = [[".", "./mod.ts"]]

  for (const { dir, files } of moduleGroups) {
    for (const file of files) {
      if (file.endsWith(".mod.ts")) continue
      const moduleName = file.replace(/\.ts$/, "")
      exports.push([`./${dir}/${moduleName}`, `./${dir}/${file}`])
    }
  }

  exports.push(["./types", "./types.ts"])
  return Object.fromEntries(exports)
}

/**
 * Replace deno.json exports with generated per-module exports.
 */
function buildDenoConfig(moduleGroups: ModuleGroup[]) {
  const denoConfig = readJsonFile("./deno.json")
  const nextDenoConfig: Record<string, unknown> = {
    ...denoConfig,
    exports: buildExportsMap(moduleGroups),
  }

  Deno.writeTextFileSync("./deno.json", `${JSON.stringify(nextDenoConfig, null, 2)}\n`)
}

const moduleGroups = listModuleGroups()
for (const group of moduleGroups) {
  buildFolderMod(group)
}
buildRootMod(moduleGroups)
buildDenoConfig(moduleGroups)

// const types = Deno.readTextFileSync("./types.ts")
// Deno.writeTextFileSync("./types.d.ts", types.replaceAll("export type ", "type "))
