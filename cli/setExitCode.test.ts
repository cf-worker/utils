import process from "node:process"
import { expect, test } from "bun:test"
import { setExitCode } from "./setExitCode.ts"

test("setExitCode prefers Deno when Deno is available", () => {
  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const previousExitCode = ("Deno" in globalThis) ? Deno.exitCode : undefined

  Object.defineProperty(globalThis, "Deno", {
    configurable: true,
    value: { exitCode: 0 },
  })

  try {
    setExitCode(7)
    expect(Deno.exitCode).toBe(7)
  } finally {
    if (previousDeno === undefined) {
      Reflect.deleteProperty(globalThis, "Deno")
    } else {
      Object.defineProperty(globalThis, "Deno", { configurable: true, value: previousDeno })
      Deno.exitCode = previousExitCode as number
    }
  }
})

test("setExitCode falls back to process when Deno is unavailable", () => {
  if ("Bun" in globalThis && !("Deno" in globalThis)) return

  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const previousExitCode = process.exitCode

  Reflect.deleteProperty(globalThis, "Deno")

  try {
    setExitCode(9)
    expect(process.exitCode).toBe(9)
  } finally {
    process.exitCode = previousExitCode
    if (previousDeno !== undefined) {
      Object.defineProperty(globalThis, "Deno", { configurable: true, value: previousDeno })
    }
  }
})
