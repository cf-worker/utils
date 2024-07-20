import { assertEquals, assertStrictEquals } from "@std/assert"

export const test = Deno.test
export const expect = (actual: unknown) => ({
  toEqual: (expected: unknown) => assertEquals(actual, expected),
  toBe: (expected: unknown) => assertStrictEquals(actual, expected),
})
