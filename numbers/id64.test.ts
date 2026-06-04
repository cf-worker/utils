import { expect, test } from "bun:test"
import { cfg, id64, id64ts, MYSQL_FORMULA, POSTGRES_FORMULA } from "./id64.ts"

const MAX_UINT64 = 18_446_744_073_709_551_615n
const MIN_ID64_20_CHARS = 10_000_000_000_000_000_000n
const OFFSET_US = 1_100_000_000_000_000n
const MULTIPLIER = 16_384n
const MIN_ID64_20_CHARS_NOW = 1_710_351_562_500
const MAX_ID64_NOW = Number((MAX_UINT64 / MULTIPLIER + OFFSET_US) / 1000n)

function baseId(now: number): bigint {
  return (BigInt(Math.trunc(now * 1000)) - OFFSET_US) * MULTIPLIER
}

function resetCfg(): void {
  cfg.lastId64 = 0n
  cfg.mask = 0n
}

test("MYSQL_FORMULA", () => {
  expect(MYSQL_FORMULA).toBe(
    "((unix_timestamp(now(6)) * 1000000 - 1100000000000000) << 14) | (uuid_short() & 16383)",
  )
})

test("POSTGRES_FORMULA", () => {
  expect(POSTGRES_FORMULA).toBe(
    "(((extract(epoch from clock_timestamp()) * 1000000)::bigint - 1100000000000000) << 14) | (nextval('id64_seq') & 16383)",
  )
})

test("id64 boundaries", () => {
  resetCfg()
  expect(id64(0)).toBe("1")

  resetCfg()
  expect(BigInt(id64(MIN_ID64_20_CHARS_NOW))).toBe(MIN_ID64_20_CHARS)

  resetCfg()
  expect(id64(MIN_ID64_20_CHARS_NOW - 1).length).toBe(19)

  resetCfg()
  const id = BigInt(id64(MAX_ID64_NOW))
  const nextId = (BigInt(MAX_ID64_NOW + 1) * 1000n - OFFSET_US) * MULTIPLIER

  expect(id <= MAX_UINT64).toBe(true)
  expect(nextId > MAX_UINT64).toBe(true)

  resetCfg()
  expect(BigInt(id64(MAX_ID64_NOW + 1))).toBe(nextId)
})

test("id64", () => {
  resetCfg()
  const now = Date.now() + 1000
  const id1 = id64(now)
  const id2 = id64(now)
  expect(id1.length).toBe(20)
  expect(id2).toBe((BigInt(id1) + 1n).toString())
  expect(id1).toBe(baseId(now).toString())
})

test("id64 mask", () => {
  resetCfg()
  cfg.mask = 0b10100000000000n

  const now = Date.now() + 1000
  const base = baseId(now)
  const maskedSuffix = 0b10100000000000n
  const id1 = id64(now)
  const id2 = id64(now)

  expect(id1).toBe((base + maskedSuffix).toString())
  expect(id2).toBe((base + maskedSuffix + 1n).toString())
  expect(BigInt(id1) % MULTIPLIER).toBe(maskedSuffix)
})

test("id64 mask edge cases", () => {
  resetCfg()
  let now = Date.now() + 1000
  expect(id64(now)).toBe(baseId(now).toString())

  resetCfg()
  cfg.mask = 0b11111111111111n
  now = Date.now() + 1000
  expect(BigInt(id64(now)) % MULTIPLIER).toBe(0b11111111111111n)
})

test("id64 counter can overflow suffix space", () => {
  resetCfg()
  const now = Date.now() + 1000
  const base = baseId(now)
  cfg.lastId64 = base + MULTIPLIER - 1n
  expect(id64(now)).toBe((base + MULTIPLIER).toString())
})

test("id64 validates mask config", () => {
  resetCfg()
  expect(() => {
    cfg.mask = -1n
  }).toThrow(RangeError)

  resetCfg()
  expect(() => {
    cfg.mask = 0b100000000000000n
  }).toThrow(RangeError)
})

test("id64ts", () => {
  resetCfg()
  const now = Date.now() + 2000
  const id = id64(now)
  const ts = id64ts(id)
  expect(ts).toBe(now)
})

test("id64ts ignores suffix bits", () => {
  resetCfg()
  cfg.mask = 0b10100000000000n
  const now = Date.now() + 2000
  const id = id64(now)
  expect(id64ts(id)).toBe(now)
})

test("id64 truncates fractional now to microseconds", () => {
  resetCfg()
  const now = Date.now() + 1000 + 0.1234567
  const truncatedBase = baseId(now)
  expect(id64(now)).toBe(truncatedBase.toString())
  expect(id64ts(id64(now + 1))).toBe(Math.trunc(now + 1))
})
