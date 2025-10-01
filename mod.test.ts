import { expect, test } from "bun:test"
import { walkFiles } from "@svarta/walk-it"
import { file } from "bun"
import { arrayUnique } from "./arrays/arrayUnique.ts"
import * as utils from "./mod.ts"

const paths = (await Array.fromAsync(
  walkFiles(".", {
    maxLevel: 2,
    recursive: true,
    filterFile: ({ name, parentPath }) =>
      name.endsWith(".ts") && !name.endsWith(".deno.ts") && !name.endsWith(".test.ts") &&
      !name.endsWith("mod.ts") && !name.endsWith("types.ts") && !parentPath.includes("/lab/"),
  }),
)).map((entry) => entry.path)

const functions = arrayUnique(
  (await Promise.all(
    paths.map(
      (path) => import(path).then((mod) => Object.keys(mod)),
    ),
  )).flat().sort(),
)

test("mod should export all functions", () => {
  expect(functions).toEqual(Object.keys(utils))
})

async function arrayFilterAsync<T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => unknown,
) {
  const filterResults = await Promise.all(arr.map(predicate))
  return arr.filter((_, index: number) => filterResults[index])
}

test("all files should have tests", async () => {
  const tests = paths.map((path) => path.replace(".ts", ".test.ts"))
  expect(tests).toEqual(await arrayFilterAsync(tests, (path) => file(path).exists()))
})
