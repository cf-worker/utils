import { expect, test } from "bun:test"
import { sleep } from "./sleep.ts"

test("sleep for 5 milliseconds", async () => {
  const duration = await sleep(5)
  expect(duration).toBeGreaterThanOrEqual(5)
  expect(duration).toBeLessThan(1000)
})

test("sleep with zero milliseconds resolves quickly", async () => {
  const duration = await sleep(0)
  expect(duration).toBeGreaterThanOrEqual(0)
  expect(duration).toBeLessThan(1000)
})
