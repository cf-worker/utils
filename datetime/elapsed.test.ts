import { assertGreaterOrEqual, assertLess } from "@std/assert"
import { elapsed } from "./elapsed.ts"
import { sleep } from "./sleep.ts"

Deno.test("elapsed should return a positive number", async () => {
  elapsed()
  await sleep(10)
  let delta = elapsed()
  assertGreaterOrEqual(delta, 10)
  assertLess(delta, 20)

  await sleep(5)
  delta = elapsed()
  assertGreaterOrEqual(delta, 5)
  assertLess(delta, 10)
})
