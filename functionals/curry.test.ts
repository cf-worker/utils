import { assertEquals } from "@std/assert"
import { curry } from "./curry.ts"

function add(a: number, b: number): number {
  return a + b
}

Deno.test("curry should return a curried function", () => {
  const curriedAdd = curry(add, 1)
  const result = curriedAdd(2)
  assertEquals(result, 3)
})

Deno.test("curry should work with multiple arguments", () => {
  const curriedAdd = curry(add, 1)
  const curry1_2 = curry(curriedAdd, 2)
  assertEquals(curry1_2(), 3)
})

Deno.test("curry should work with variadic arguments", () => {
  const join = (...args: string[]) => args.join("-")
  const curriedJoin = curry(join, "a")
  const result = curriedJoin("b", "c")
  assertEquals(result, "a-b-c")
})
