import { expect, spyOn, test } from "bun:test"
import { elapsed } from "./elapsed.ts"
import { sleep } from "./sleep.ts"

test("elapsed should return a positive number", async () => {
  elapsed()
  await sleep(10)
  const delta1 = elapsed()
  await sleep(10)
  const delta2 = elapsed()

  expect(delta1).toBeGreaterThanOrEqual(10)
  expect(delta1).toBeLessThan(20)
  expect(delta2).toBeGreaterThanOrEqual(10)
  expect(delta2).toBeLessThan(20)
})

test("elapsed with label", async () => {
  elapsed("test")
  await sleep(10)
  const delta1 = elapsed("test")
  await sleep(10)
  const delta2 = elapsed("test")

  expect(delta1).toBeGreaterThanOrEqual(10)
  expect(delta1).toBeLessThan(20)
  expect(delta2).toBeGreaterThanOrEqual(10)
  expect(delta2).toBeLessThan(25)
})

test("elapsed.log", async () => {
  const info = spyOn(console, "info")
  try {
    elapsed("log")
    await sleep(10)
    expect(info).toHaveBeenCalledTimes(0)
    const delta = elapsed.log("log")
    expect(delta).toBeGreaterThanOrEqual(10)
    expect(delta).toBeLessThan(30)
    expect(info).toHaveBeenCalledTimes(1)
  } finally {
    info.mockRestore()
  }
})

test("elapsed.new", async () => {
  let elapse = elapsed.new()
  await sleep(10)
  let lap = elapse.lap()
  let delta = elapse()
  expect(delta).toBeGreaterThanOrEqual(10)
  expect(delta).toBeLessThan(20)
  expect(lap).toBeGreaterThanOrEqual(10)
  expect(lap).toBeLessThan(20)

  elapse = elapsed.new()
  await sleep(10)
  lap = elapse.lap()
  delta = elapse()
  expect(delta).toBeGreaterThanOrEqual(10)
  expect(delta).toBeLessThan(20)
  expect(lap).toBeGreaterThanOrEqual(10)
  expect(lap).toBeLessThan(20)

  await sleep(10)
  lap = elapse.lap()
  delta = elapse()
  expect(delta).toBeGreaterThanOrEqual(20)
  expect(delta).toBeLessThan(30)
  expect(lap).toBeGreaterThanOrEqual(10)
  expect(lap).toBeLessThan(20)
})

test("elapsed.new(label)", async () => {
  const info = spyOn(console, "info")
  try {
    const elapse = elapsed.new()
    await sleep(10)
    expect(info).toHaveBeenCalledTimes(0)
    const delta = elapse("log")
    expect(delta).toBeGreaterThanOrEqual(10)
    expect(delta).toBeLessThan(30)
    expect(info).toHaveBeenCalledTimes(1)
  } finally {
    info.mockRestore()
  }
})
