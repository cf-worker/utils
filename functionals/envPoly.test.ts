import { expect, test } from "bun:test"
import { envPoly } from "./envPoly.ts"

test("envPoly", () => {
  expect(envPoly("DOES_NOT_EXISTS")).toBeUndefined()
  expect(typeof envPoly("PWD")).toBe("string")
})

test("Bun", () => {
  if ("Bun" in globalThis) return
  const Deno = globalThis.Deno
  // @ts-expect-error: Deno may not exist on globalThis
  delete globalThis.Deno
  // deno-lint-ignore no-explicit-any
  const global: any = globalThis
  global.Bun = {
    env: {
      HOME: "/home/root",
    },
  }
  expect(envPoly("HOME")).toBe(global.Bun.env.HOME)
  globalThis.Deno = Deno
})

test("process", () => {
  if ("process" in globalThis) return
  const Deno = globalThis.Deno
  // @ts-expect-error: Deno may not exist on globalThis
  delete globalThis.Deno
  // deno-lint-ignore no-explicit-any
  const global: any = globalThis
  global.process = {
    env: {
      HOME: "/home/root",
    },
  }
  expect(envPoly("HOME")).toBe(global.process.env.HOME)
  globalThis.Deno = Deno
})
