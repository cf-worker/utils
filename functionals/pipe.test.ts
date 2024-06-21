import { assertEquals } from "@std/assert"
import { pipe, pipe2, pipe3 } from "./pipe.ts"

Deno.test("pipe should return the result of applying all functions in order", () => {
  const trim = (s: string) => s.trim()
  const reverse = (s: string) => [...s].reverse()
  const join = (a: string[]) => a.join("")
  const result = pipe(trim, reverse, join)(" hello ")

  assertEquals(result, "olleh")
})

Deno.test("pipe2", () => {
  const truthy = pipe2(Number.parseFloat, Number.isInteger)
  const falsy = pipe2(Number.parseFloat, Number.isInteger)
  assertEquals(truthy("1"), true)
  assertEquals(falsy("1.2"), false)
})

Deno.test("pipe3", () => {
  const trim = (s: string) => s.trim()
  const reverse = (s: string) => [...s].reverse()
  const join = (a: string[]) => a.join("")
  const result = pipe3(trim, reverse, join)

  assertEquals(result(" hello "), "olleh")
})
