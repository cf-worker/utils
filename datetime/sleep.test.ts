import { expect, test } from "bun:test"
import { sleep } from "./sleep.ts"

test("sleep for 100 milliseconds", async () => {
  const start = Date.now()
  const duration = await sleep(10)
  const end = Date.now()
  expect(duration).toBe(end - start)
})

test("sleep for 50 milliseconds", async () => {
  const start = Date.now()
  const duration = await sleep(50)
  const end = Date.now()
  expect(end - start).toBeGreaterThanOrEqual(duration)
  expect(end - start).toBeLessThan(duration + 2)
})
