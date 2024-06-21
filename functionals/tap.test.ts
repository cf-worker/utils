import { assertEquals } from "@std/assert"
import { tap } from "./tap.ts"

Deno.test("tap should call the provided function with the value", () => {
  const out: number[] = []
  function log(value: number) {
    out.push(value)
  }
  const input = [1, 2, 3]
  const result = input.map(tap(log))
  assertEquals(result, input)
  assertEquals(out, input)
})
