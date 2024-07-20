import { assertGreaterOrEqual, assertLess } from "@std/assert"
import { assertSpyCalls, stub } from "@std/testing/mock"
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

Deno.test("elapsed with label", async () => {
  elapsed("test")
  await sleep(10)
  let delta = elapsed("test")
  assertGreaterOrEqual(delta, 10)
  assertLess(delta, 20)

  await sleep(5)
  delta = elapsed("test")
  assertGreaterOrEqual(delta, 5)
  assertLess(delta, 10)
})

Deno.test("elapsed.log", async () => {
  const info = stub(console, "info")
  try {
    elapsed("log")
    await sleep(10)
    const delta = elapsed.log("log")
    assertGreaterOrEqual(delta, 10)
    assertLess(delta, 20)
    assertSpyCalls(info, 1)
  } finally {
    info.restore()
  }
})
