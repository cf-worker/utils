import { expect, test } from "bun:test"
import { tap } from "./tap.ts"

test("tap should call the provided function with the value", () => {
  const out: number[] = []
  function log(value: number) {
    out.push(value)
  }
  const input = [1, 2, 3]
  const result = input.map(tap(log))
  expect(result).toEqual(input)
  expect(out).toEqual(input)
})
