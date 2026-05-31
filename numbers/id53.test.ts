import { expect, test } from "bun:test"
import { id53, id53ts } from "./id53.ts"

test("id53 returns a safe integer with max 16 digits", () => {
  const id = id53()
  expect(typeof id).toBe("number")
  expect(String(id).length).toBeLessThanOrEqual(16)
})

test("id53 generates unique monotonically increasing ids", () => {
  const id1 = id53()
  const id2 = id53()
  const id3 = id53()
  expect(id2).toBeGreaterThanOrEqual(id1)
  expect(id3).toBeGreaterThanOrEqual(id2)
})

test("id53 handles rapid successive calls without collision", () => {
  const ids = new Set<number>()
  for (let i = 0; i < 1000; i++) {
    ids.add(id53())
  }
  expect(ids.size).toBe(1000)
})

test("id53 is within safe integer bounds", () => {
  const id = id53()
  expect(id).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER)
})

test("id53ts extracts timestamp from id53", () => {
  const id = id53()
  const ts = id53ts(id)
  expect(typeof ts).toBe("number")
})

test("id53ts timestamp is in milliseconds (13 digits for current era)", () => {
  const id = id53()
  const ts = id53ts(id)
  expect(String(ts).length).toBe(13)
})

test("id53ts roundtrip preserves timestamp precision", () => {
  const id = id53()
  const ts = id53ts(id)
  expect(Math.trunc(id / 1000)).toBe(ts)
})

test("id53ts timestamp is close to current time", () => {
  const before = Date.now()
  const id = id53()
  const ts = id53ts(id)
  const after = Date.now()
  expect(ts).toBeGreaterThanOrEqual(before - 1000)
  expect(ts).toBeLessThanOrEqual(after + 1000)
})

test("id53ts handles zero", () => {
  const ts = id53ts(0)
  expect(ts).toBe(0)
})

test("id53ts handles large id", () => {
  const maxId = Number.MAX_SAFE_INTEGER
  const ts = id53ts(maxId)
  expect(ts).toBe(Math.trunc(maxId / 1000))
})

test("id53ts handles negative id", () => {
  const ts = id53ts(-1000)
  expect(ts).toBe(-1)
})

test("id53ts handles fractional id", () => {
  const ts = id53ts(1234567890.5)
  expect(ts).toBe(1234567)
})

test("id53 ids are sortable by creation time", () => {
  const ids: number[] = []
  for (let i = 0; i < 50; i++) {
    ids.push(id53())
  }
  const sorted = [...ids].sort((a, b) => a - b)
  expect(ids).toEqual(sorted)
})

test("id53ts is idempotent", () => {
  const id = id53()
  const ts1 = id53ts(id)
  const ts2 = id53ts(id)
  expect(ts1).toBe(ts2)
})

test("id53 timestamp matches approximate Date.now()", () => {
  const before = Date.now()
  const id = id53()
  const after = Date.now()
  const ts = id53ts(id)
  expect(ts).toBeGreaterThanOrEqual(before - 1000)
  expect(ts).toBeLessThanOrEqual(after + 1000)
})
