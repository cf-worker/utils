import { expect, test } from "bun:test"
import { readdir, readFile } from "node:fs/promises"

type DenoConfig = {
  exports?: string | Record<string, string>
}

test("deno.json should expose root and subpath exports", async () => {
  const config = JSON.parse(await readFile("./deno.json", "utf8")) as DenoConfig

  expect(typeof config.exports).toBe("object")

  const exportsMap = config.exports as Record<string, string>
  expect(exportsMap["."]).toBe("./mod.ts")
  expect(exportsMap["./types"]).toBe("./types.ts")
  expect(exportsMap["./encoding/removeAccents"]).toBe("./encoding/removeAccents.ts")

  const entries = await readdir(".", { withFileTypes: true })
  const moduleDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && !["coverage", "lab", "node_modules"].includes(name))

  for (const dir of moduleDirs) {
    const files = await readdir(`./${dir}`)
    const hasModule = files.some((file) =>
      file.endsWith(".ts") && !file.endsWith(".test.ts") && !file.endsWith(".deno.ts") &&
      !file.endsWith(".mod.ts") && file !== "mod.ts"
    )
    if (!hasModule) continue
    expect(Object.keys(exportsMap).some((key) => key.startsWith(`./${dir}/`))).toBe(true)
  }
})
