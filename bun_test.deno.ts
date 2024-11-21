import { assertEquals, assertGreater, assertStrictEquals, assertThrows } from "@std/assert"
import { spy } from "@std/testing/mock"

function asSpy(actual: unknown) {
  // TODO: add tests
  // if (!(actual instanceof Function)) {
  //   throw "function expected"
  // }
  // if (actual.name !== "spy") {
  //   throw "spy expected"
  // }
  return actual as ReturnType<typeof spy>
}

export const test = Deno.test
export const expect = (actual: unknown) => ({
  toEqual: (expected: unknown) => assertEquals(actual, expected),

  toBe: (expected: unknown) => assertStrictEquals(actual, expected),

  toBeUndefined: () => assertStrictEquals(actual, undefined),

  // toBeGreaterThanOrEqual: (expected: number) => assertGreaterOrEqual(actual as number, expected),

  // toBeGreaterThan: (expected: number) => assertGreater(actual as number, expected),

  // toBeLessThanOrEqual: (expected: number) => assertLessOrEqual(actual as number, expected),

  // toBeLessThan: (expected: number) => assertLess(actual, expected),

  // toBeNaN: () => assertStrictEquals(Number.isNaN(actual as number), true),

  toThrow: (expected: Parameters<typeof assertThrows>[1]) =>
    assertThrows(actual as () => unknown, expected),

  toHaveBeenCalled: () => assertGreater(asSpy(actual).calls.length, 0),

  toHaveBeenCalledTimes: (times: number) => assertStrictEquals(asSpy(actual).calls.length, times),
})

export const mock = (fn: (...args: unknown[]) => unknown) => {
  return spy(fn)
}
