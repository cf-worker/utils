import { assertEquals } from "@std/assert"
import { pluck } from "./pluck.ts"

Deno.test("pluck should return an array of values extracted from objects", () => {
  const array = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 35 },
  ]

  const result = pluck(array, "name")

  assertEquals(result, ["John", "Jane", "Bob"])
})

Deno.test("pluck should return an empty array when input array is empty", () => {
  // deno-lint-ignore no-explicit-any
  const array: any[] = []

  const result = pluck(array, "name")

  assertEquals(result, [])
})

Deno.test("pluck should return an array of undefined values when key does not exist in objects", () => {
  const array = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 35 },
  ]

  // @ts-expect-error email does not exist in the object
  const result = pluck(array, "email")
  // @ts-expect-error email does not exist in the object
  assertEquals(result, [undefined, undefined, undefined])
})
