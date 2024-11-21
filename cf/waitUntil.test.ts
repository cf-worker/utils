import { expect, mock, test } from "bun:test"
import { waitUntilPush, waitUntilShift } from "./waitUntil.ts"

test("waitUntil happy path", () => {
  const fn = mock(() => 1)
  waitUntilPush(fn)
  waitUntilPush(fn)
  waitUntilPush(Promise.resolve(1))
  const length = waitUntilShift({
    async waitUntil(promise: Promise<unknown>) {
      await promise
    },
  })
  expect(length).toBe(3)
  expect(fn).toHaveBeenCalled()
  expect(fn).toHaveBeenCalledTimes(2)
})
