import { expect, test } from "bun:test"
import { existsSync, walkSync } from "@std/fs"
import * as utils from "./mod.ts"

const paths = Array.from(
  walkSync(".", {
    maxDepth: 2,
    includeDirs: false,
    exts: [".ts"],
    skip: [/\.test\.ts/, /mod\.ts/, /\.deno\.ts/, /types\.ts/],
  }),
).map((entry) => `./${entry.path}`)

const functions = (
  await Promise.all(
    paths.map(
      (path) => import(path).then((mod) => Object.keys(mod)),
    ),
  )
).flat().sort()

test("mod should export all functions", () => {
  expect(functions).toEqual(Object.keys(utils))
})

test("all files should have tests", () => {
  const tests = paths.map((path) => path.replace(".ts", ".test.ts"))
  expect(tests).toEqual(tests.filter((path) => existsSync(path)))
})
