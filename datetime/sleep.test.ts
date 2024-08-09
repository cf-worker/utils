import { assertEquals, assertGreaterOrEqual, assertLess } from "@std/assert"
import { sleep } from "./sleep.ts"

Deno.test("sleep for 100 milliseconds", async () => {
  const start = Date.now()
  const duration = await sleep(10)
  const end = Date.now()
  assertEquals(duration, end - start)
})

Deno.test("sleep for 50 milliseconds", async () => {
  const start = Date.now()
  const duration = await sleep(50)
  const end = Date.now()
  assertGreaterOrEqual(end - start, duration)
  assertLess(end - start, duration + 2)
})
