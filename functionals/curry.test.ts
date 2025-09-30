import { expect, test } from "bun:test"
import { curry } from "./curry.ts"

function add(a: number, b: number): number {
  return a + b
}

test("curry should return a curried function", () => {
  const curriedAdd = curry(add, 1)
  const result = curriedAdd(2)
  expect(result).toBe(3)
})

test("curry should work with multiple arguments", () => {
  const curriedAdd = curry(add, 1)
  const curry1_2 = curry(curriedAdd, 2)
  expect(curry1_2()).toBe(3)
})

test("curry should work with variadic arguments", () => {
  const join = (...args: string[]) => args.join("-")
  const curriedJoin = curry(join, "a")
  const result = curriedJoin("b", "c")
  expect(result).toBe("a-b-c")
})
