import { expect, test } from "bun:test"
import { sleep } from "./sleep.ts"

test("sleep for 10 milliseconds", async () => {
  const duration = await sleep(10)
  expect(duration).toBeGreaterThanOrEqual(10)
  expect(duration).toBeLessThan(1000)
})

test("sleep for 50 milliseconds", async () => {
  const duration = await sleep(50)
  expect(duration).toBeGreaterThanOrEqual(50)
  expect(duration).toBeLessThan(1000)
})

test("sleep with zero milliseconds resolves quickly", async () => {
  const duration = await sleep(0)
  expect(duration).toBeGreaterThanOrEqual(0)
  expect(duration).toBeLessThan(1000)
})
