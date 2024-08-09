import { assertGreaterOrEqual, assertLess } from "@std/assert"
import { assertSpyCalls, stub } from "@std/testing/mock"
import { elapsed } from "./elapsed.ts"
import { sleep } from "./sleep.ts"

Deno.test("elapsed should return a positive number", async () => {
  elapsed()
  await sleep(10)
  const delta1 = elapsed()
  await sleep(10)
  const delta2 = elapsed()

  assertGreaterOrEqual(delta1, 10)
  assertLess(delta1, 20)
  assertGreaterOrEqual(delta2, 10)
  assertLess(delta2, 20)
})

Deno.test("elapsed with label", async () => {
  elapsed("test")
  await sleep(10)
  const delta1 = elapsed("test")
  await sleep(10)
  const delta2 = elapsed("test")

  assertGreaterOrEqual(delta1, 10)
  assertLess(delta1, 20)
  assertGreaterOrEqual(delta2, 10)
  assertLess(delta2, 25)
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
