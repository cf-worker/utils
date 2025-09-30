import { expect, test } from "bun:test"
import { pluck } from "./pluck.ts"

test("pluck should return an array of values extracted from objects", () => {
  const array = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 35 },
  ]

  const result = pluck(array, "name")

  expect(result).toEqual(["John", "Jane", "Bob"])
})

test("pluck should return an empty array when input array is empty", () => {
  // deno-lint-ignore no-explicit-any
  const array: any[] = []

  const result = pluck(array, "name")

  expect(result).toEqual([])
})

test("pluck should return an array of undefined values when key does not exist in objects", () => {
  const array = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 35 },
  ]

  // @ts-expect-error email does not exist in the object
  const result = pluck(array, "email")
  expect(result).toEqual([undefined, undefined, undefined])
})
