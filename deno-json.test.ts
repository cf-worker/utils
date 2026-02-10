import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

type DenoConfig = {
  exports?: string | Record<string, string>
}

test("deno.json should expose root and subpath exports", async () => {
  const config = JSON.parse(await readFile("./deno.json", "utf8")) as DenoConfig

  expect(typeof config.exports).toBe("object")

  const exportsMap = config.exports as Record<string, string>
  expect(exportsMap["."]).toBe("./mod.ts")
  expect(exportsMap["./encoding/removeAccents"]).toBe("./encoding/removeAccents.ts")
})
