import type { ExecutionContext } from "../types.ts"

/**
 * A promise or a function with no params
 */
export type Waitable = Promise<unknown> | (() => unknown)
/**
 * This constant is shared between different executions,
 * so a running fetch handler may execute a promise enqueued by another execution context.
 */
const WAITABLE_QUEUE: Waitable[] = []

/**
 * Adds a function to the queue to be processed later by ExecutionContext.waitUntil.
 * This function makes it easy for any part of the code be able to schedule promise to be executed
 * after the execution context.
 *
 * @param fn - The function to be added to the queue.
 * @returns void
 */
export function waitUntilPush(fn: Waitable): void {
  WAITABLE_QUEUE.push(fn)
}

/**
 * Processes all functions in the queue by passing them to the provided waitUntil function.
 * Better be called in a finally block inside the main handler.
 *
 * @param waitUntil - ExecutionContext.waitUntil
 * @returns void
 */
export function waitUntilShift(ec: Pick<ExecutionContext, "waitUntil">): number {
  const length = WAITABLE_QUEUE.length
  let i = 0
  while (WAITABLE_QUEUE.length > 0) {
    const waitable = WAITABLE_QUEUE.shift()
    if (!waitable) continue
    i++
    console.info(`waitUntil(${i}/${length}): ${waitable}`)
    const promise = waitable instanceof Promise ? waitable : Promise.resolve(waitable())
    // TODO: log the result of the promise and if it succeeded
    ec.waitUntil(promise)
  }
  return length
}
