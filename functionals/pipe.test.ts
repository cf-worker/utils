import { expect, test } from "bun:test"
import { pipe, pipe2, pipe3 } from "./pipe.ts"

test("pipe should return the result of applying all functions in order", () => {
  const trim = (s: string) => s.trim()
  const reverse = (s: string) => [...s].reverse()
  const join = (a: string[]) => a.join("")
  const result = pipe(trim, reverse, join)(" hello ")

  expect(result).toBe("olleh")
})

test("pipe2", () => {
  const truthy = pipe2(Number.parseFloat, Number.isInteger)
  const falsy = pipe2(Number.parseFloat, Number.isInteger)
  expect(truthy("1")).toBe(true)
  expect(falsy("1.2")).toBe(false)
})

test("pipe3", () => {
  const trim = (s: string) => s.trim()
  const reverse = (s: string) => [...s].reverse()
  const join = (a: string[]) => a.join("")
  const result = pipe3(trim, reverse, join)

  expect(result(" hello ")).toBe("olleh")
})
