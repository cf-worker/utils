/**
 * functionals/curry module.
 * @module
 */
import type { Func, Rest } from "../types.ts"

/**
 * Curry a function so arguments can be provided incrementally.
 */
export function curry<T extends Func>(
  fn: T,
  arg1: Parameters<T>[0],
): (...rest: Rest<T>) => ReturnType<T> {
  return (...rest: Rest<T>): ReturnType<T> => fn(arg1, ...rest)
}
