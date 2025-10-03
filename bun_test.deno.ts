import {
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertLess,
  assertLessOrEqual,
  assertStrictEquals,
  assertThrows,
} from "@std/assert"
import { spy } from "@std/testing/mock"

export function spyOn<Self, Prop extends keyof Self>(
  self: Self,
  property: Prop,
) {
  const mockSpy = spy(self, property)
  const mockRestore = mockSpy.restore.bind(mockSpy)
  const restore = { mockRestore }
  Object.assign(mockSpy, restore)
  return mockSpy as typeof mockSpy & typeof restore
}

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
  toBeNull: () => assertStrictEquals(actual, null),

  toBeGreaterThanOrEqual: (expected: number) => assertGreaterOrEqual(actual as number, expected),

  toBeLessThanOrEqual: (expected: number) => assertLessOrEqual(actual as number, expected),

  toBeLessThan: (expected: number) => assertLess(actual, expected),

  toBeInstanceOf: (expectedType: Parameters<typeof assertInstanceOf>[1]) =>
    assertInstanceOf(actual, expectedType),

  toThrow: (expected?: unknown) => assertThrows(actual as () => unknown, expected as string),

  toHaveBeenCalledTimes: (times: number) => assertStrictEquals(asSpy(actual).calls.length, times),
  // toBeGreaterThan: (expected: number) => assertGreater(actual as number, expected),
  // toBeNaN: () => assertStrictEquals(Number.isNaN(actual as number), true),
  // toHaveBeenCalled: () => assertGreater(asSpy(actual).calls.length, 0),
})

// export const mock = (fn: (...args: unknown[]) => unknown) => {
//   return spy(fn)
// }
