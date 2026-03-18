import process from "node:process"
import { expect, test } from "bun:test"
import { args } from "./args.ts"

test("args prefers Deno when Deno is available", () => {
  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno

  Object.defineProperty(globalThis, "Deno", {
    configurable: true,
    value: { args: ["--format", "pem"] },
  })

  try {
    expect(args()).toEqual(["--format", "pem"])
  } finally {
    if (previousDeno === undefined) {
      Reflect.deleteProperty(globalThis, "Deno")
    } else {
      Object.defineProperty(globalThis, "Deno", { configurable: true, value: previousDeno })
    }
  }
})

test("args falls back to Bun when Deno is unavailable", () => {
  if ("Bun" in globalThis && !("Deno" in globalThis)) {
    expect(args()).toEqual(process.argv.slice(2))
    return
  }

  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun

  Reflect.deleteProperty(globalThis, "Deno")
  Object.defineProperty(globalThis, "Bun", {
    configurable: true,
    value: { argv: ["bun", "script.ts", "key"] },
  })

  try {
    expect(args()).toEqual(process.argv.slice(2))
  } finally {
    if (previousDeno !== undefined) {
      Object.defineProperty(globalThis, "Deno", { configurable: true, value: previousDeno })
    }
    if (previousBun === undefined) {
      Reflect.deleteProperty(globalThis, "Bun")
    } else {
      Object.defineProperty(globalThis, "Bun", { configurable: true, value: previousBun })
    }
  }
})

test("args falls back to Node when Deno and Bun are unavailable", () => {
  if ("Bun" in globalThis && !("Deno" in globalThis)) return

  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun

  Reflect.deleteProperty(globalThis, "Deno")
  Reflect.deleteProperty(globalThis, "Bun")

  try {
    expect(args()).toEqual(process.argv.slice(2))
  } finally {
    if (previousDeno !== undefined) {
      Object.defineProperty(globalThis, "Deno", { configurable: true, value: previousDeno })
    }
    if (previousBun !== undefined) {
      Object.defineProperty(globalThis, "Bun", { configurable: true, value: previousBun })
    }
  }
})
