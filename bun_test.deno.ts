import {
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertLess,
  assertLessOrEqual,
  assertMatch,
  assertStrictEquals,
  assertThrows,
} from "@std/assert"
import { spy } from "@std/testing/mock"

type Constructable = abstract new (...args: never[]) => unknown

/**
 * Callable function shape extracted from a property.
 */
export type Callable<T> = T extends { (...args: infer Args): infer Ret } ? (...args: Args) => Ret
  : never

/**
 * Public result shape returned by `spyOn`.
 */
export type SpyOnResult<Self extends object, Prop extends keyof Self> = {
  mockRestore: () => void
  mockImplementation: (implementation: Callable<Self[Prop]>) => unknown
}

/**
 * Create a spy for an object property and expose Bun-like mock helpers.
 */
export function spyOn<Self extends object, Prop extends keyof Self>(
  self: Self,
  property: Prop,
): SpyOnResult<Self, Prop> {
  const mockSpy = spy(self, property)
  const mockRestore = mockSpy.restore.bind(mockSpy)
  const mockImplementation = (implementation: Callable<Self[Prop]>) => {
    ;(self as Record<PropertyKey, unknown>)[property as PropertyKey] = implementation
    return mockSpy
  }
  const extra = { mockRestore, mockImplementation }
  Object.assign(mockSpy, extra)
  return mockSpy as typeof mockSpy & typeof extra
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

/**
 * Test declaration compatible with Bun's `test`.
 */
export const test: typeof Deno.test = Deno.test
/**
 * Matchers available in `expect`.
 */
export type ExpectMatchers = {
  toEqual: (expected: unknown) => void
  toBe: (expected: unknown) => void
  toBeUndefined: () => void
  toBeNull: () => void
  toBeGreaterThanOrEqual: (expected: number) => void
  toBeLessThanOrEqual: (expected: number) => void
  toBeLessThan: (expected: number) => void
  toBeInstanceOf: (expectedType: Constructable) => void
  toThrow: (expected?: unknown) => void
  toMatch: (expected: RegExp | string) => void
  toHaveBeenCalledTimes: (times: number) => void
}

/**
 * Assertion entry function.
 */
export type ExpectFn = (actual: unknown) => ExpectMatchers

/**
 * Bun-like expectation API built on top of `@std/assert`.
 */
export const expect: ExpectFn = (actual: unknown) => ({
  toEqual: (expected: unknown) => assertEquals(actual, expected),

  toBe: (expected: unknown) => assertStrictEquals(actual, expected),

  toBeUndefined: () => assertStrictEquals(actual, undefined),
  toBeNull: () => assertStrictEquals(actual, null),

  toBeGreaterThanOrEqual: (expected: number) => assertGreaterOrEqual(actual as number, expected),

  toBeLessThanOrEqual: (expected: number) => assertLessOrEqual(actual as number, expected),

  toBeLessThan: (expected: number) => assertLess(actual, expected),

  toBeInstanceOf: (expectedType: Constructable) => assertInstanceOf(actual, expectedType),

  toThrow: (expected?: unknown) => assertThrows(actual as () => unknown, expected as string),

  toMatch: (expected: RegExp | string) => {
    if (expected instanceof RegExp) {
      assertMatch(String(actual), expected)
      return
    }
    assertStrictEquals(String(actual).includes(expected), true)
  },

  toHaveBeenCalledTimes: (times: number) => assertStrictEquals(asSpy(actual).calls.length, times),
  // toBeGreaterThan: (expected: number) => assertGreater(actual as number, expected),
  // toBeNaN: () => assertStrictEquals(Number.isNaN(actual as number), true),
  // toHaveBeenCalled: () => assertGreater(asSpy(actual).calls.length, 0),
})

// export const mock = (fn: (...args: unknown[]) => unknown) => {
//   return spy(fn)
// }
