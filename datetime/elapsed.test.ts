import { expect, spyOn, test } from "bun:test"
import { elapsed } from "./elapsed.ts"

function spyFirstArg(spy: unknown): unknown {
  const denoCalls = (spy as { calls?: Array<{ args?: unknown[] }> }).calls
  if (denoCalls?.[0]?.args) return denoCalls[0].args[0]

  const bunCalls = (spy as { mock?: { calls?: unknown[][] } }).mock?.calls
  if (bunCalls?.[0]) return bunCalls[0][0]

  return undefined
}

test("elapsed should return deterministic deltas", () => {
  const originalNow = Date.now
  const times = [1000, 1010, 1025]
  Date.now = () => times.shift() ?? originalNow()
  try {
    const label = "deterministic-default"
    const delta1 = elapsed(label)
    const delta2 = elapsed(label)

    expect(delta1).toBe(0)
    expect(delta2).toBe(10)
  } finally {
    Date.now = originalNow
  }
})

test("elapsed with label", () => {
  const originalNow = Date.now
  const times = [2000, 2020]
  Date.now = () => times.shift() ?? originalNow()
  try {
    const delta1 = elapsed("test")
    const delta2 = elapsed("test")

    expect(delta1).toBe(0)
    expect(delta2).toBe(20)
  } finally {
    Date.now = originalNow
  }
})

test("elapsed.log", () => {
  const info = spyOn(console, "info")
  const originalNow = Date.now
  const times = [3000, 3012]
  Date.now = () => times.shift() ?? originalNow()
  try {
    elapsed("log")

    expect(info).toHaveBeenCalledTimes(0)
    const delta = elapsed.log("log")
    expect(delta).toBe(12)
    expect(info).toHaveBeenCalledTimes(1)
    expect(spyFirstArg(info)).toBe("elapsed:log 12ms")
  } finally {
    info.mockRestore()
    Date.now = originalNow
  }
})

test("elapsed.start", () => {
  const originalNow = Date.now
  const times = [1000, 1010, 1010, 1025, 1025, 1040, 1040, 1060, 1060]
  Date.now = () => times.shift() ?? originalNow()
  try {
    const elapse = elapsed.start()
    const lap = elapse.lap()
    const delta = elapse()
    const lap2 = elapse.lap()
    const delta2 = elapse()

    expect(lap).toBe(10)
    expect(delta).toBe(25)
    expect(lap2).toBe(15)
    expect(delta2).toBe(60)
  } finally {
    Date.now = originalNow
  }
})

test("elapsed.start(label)", () => {
  const info = spyOn(console, "info")
  const originalNow = Date.now
  const times = [5000, 5018, 5018]
  Date.now = () => times.shift() ?? originalNow()
  try {
    const elapse = elapsed.start()

    expect(info).toHaveBeenCalledTimes(0)
    const delta = elapse("log")
    expect(delta).toBe(18)
    expect(info).toHaveBeenCalledTimes(1)
    expect(spyFirstArg(info)).toBe("elapsed:log 18ms")
  } finally {
    info.mockRestore()
    Date.now = originalNow
  }
})
