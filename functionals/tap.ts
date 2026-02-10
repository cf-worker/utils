import type { Func } from "../types.ts"

/**
 * Run a side-effect function and return the first argument.
 */
export function tap<T extends Func>(fn: T): (...args: Parameters<T>) => Parameters<T>[0] {
  return (...args: Parameters<T>) => {
    fn(...args)
    return args[0]
  }
}
