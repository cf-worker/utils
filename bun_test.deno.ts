import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert"

export const test = Deno.test
export const expect = (actual: unknown) => ({
  toEqual: (expected: unknown) => assertEquals(actual, expected),
  toBe: (expected: unknown) => assertStrictEquals(actual, expected),
  toBeUndefined: () => assertStrictEquals(actual, undefined),
  toThrow: (expected: Parameters<typeof assertThrows>[1]) =>
    assertThrows(actual as () => unknown, expected),
})
