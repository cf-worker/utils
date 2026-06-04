import { expect, test } from "bun:test"
import { quoteRaw } from "./quoteRaw.ts"
import { quoteValue } from "./quoteValue.ts"

test("quoteValue quotes strings and escapes single quotes", () => {
  expect(quoteValue("hello")).toBe("'hello'")
  expect(quoteValue("it's ready")).toBe("'it''s ready'")
})

test("quoteValue preserves double quotes inside string literals", () => {
  expect(quoteValue('say "hello"')).toBe("'say \"hello\"'")
})

test("quoteValue formats finite numbers without quotes", () => {
  expect(quoteValue(0)).toBe("0")
  expect(quoteValue(-42)).toBe("-42")
  expect(quoteValue(3.14)).toBe("3.14")
})

test("quoteValue formats Number objects like primitive numbers", () => {
  expect(quoteValue(new Number(7))).toBe("7")
  expect(quoteValue(new Number(Number.NaN))).toBe("NULL")
})

test("quoteValue formats booleans without quotes", () => {
  expect(quoteValue(true)).toBe("true")
  expect(quoteValue(false)).toBe("false")
})

test("quoteValue formats Boolean objects like primitive booleans", () => {
  expect(quoteValue(new Boolean(true))).toBe("true")
  expect(quoteValue(new Boolean(false))).toBe("false")
})

test("quoteValue formats nullish and NaN values as NULL", () => {
  expect(quoteValue(null)).toBe("NULL")
  expect(quoteValue(undefined)).toBe("NULL")
  expect(quoteValue(Number.NaN)).toBe("NULL")
})

test("quoteValue formats non-finite numbers as NULL", () => {
  expect(quoteValue(Infinity)).toBe("NULL")
  expect(quoteValue(-Infinity)).toBe("NULL")
})

test("quoteValue formats valid dates as SQL datetime literals", () => {
  expect(quoteValue(new Date("2026-05-20T18:30:45.123Z"))).toBe("'2026-05-20 18:30:45.123'")
})

test("quoteValue formats invalid dates as NULL", () => {
  expect(quoteValue(new Date("invalid"))).toBe("NULL")
})

test("quoteValue formats arrays as parenthesized comma-separated literals", () => {
  expect(quoteValue([1, "two", null, true])).toBe("(1, 'two', NULL, true)")
})

test("quoteValue formats empty arrays as NULL tuple", () => {
  expect(quoteValue([])).toBe("(NULL)")
})

test("quoteValue formats nested arrays recursively", () => {
  expect(quoteValue([[1, 2], ["a", "b"]])).toBe("((1, 2), ('a', 'b'))")
})

test("quoteValue formats sets as arrays", () => {
  expect(quoteValue(new Set([1, "two", null]))).toBe("(1, 'two', NULL)")
})

test("quoteValue formats records as identifier predicates joined by comma by default", () => {
  expect(quoteValue({ id: 7, name: "Ada" })).toBe("`id` = 7,\n`name` = 'Ada'")
})

test("quoteValue supports double-quoted record identifiers", () => {
  expect(quoteValue({ "users.id": [1, 2] }, '"')).toBe('"users"."id" IN (1, 2)')
})

test("quoteValue formats maps as records", () => {
  expect(quoteValue(new Map<string, unknown>([["id", 7], ["name", "Ada"]]))).toBe(
    "`id` = 7,\n`name` = 'Ada'",
  )
})

test("quoteValue formats maps with described symbol keys as records", () => {
  expect(quoteValue(new Map<symbol, unknown>([[Symbol("id"), 7]]))).toBe("`id` = 7")
})

test("quoteValue rejects maps with unsupported keys", () => {
  expect(() => quoteValue(new Map<unknown, unknown>([[1, "Ada"]]))).toThrow(
    "SQL record map keys must be strings or described symbols",
  )
  expect(() => quoteValue(new Map<symbol, unknown>([[Symbol(), "Ada"]]))).toThrow(
    "SQL record map keys must be strings or described symbols",
  )
})

test("quoteValue formats record arrays with IN operator", () => {
  expect(quoteValue({ id: [1, 2, 3] })).toBe("`id` IN (1, 2, 3)")
})

test("quoteValue supports AND and OR joins for record predicates", () => {
  expect(quoteValue({ id: 7, active: true }, " AND")).toBe("`id` = 7 AND\n`active` = true")
  expect(quoteValue({ id: 7, active: true }, " OR")).toBe("`id` = 7 OR\n`active` = true")
})

test("quoteValue quotes dotted record keys as dotted identifiers", () => {
  expect(quoteValue({ "users.id": 7 })).toBe("`users`.`id` = 7")
})

test("quoteValue throws when record keys are invalid SQL identifiers", () => {
  expect(() => quoteValue({ "users.id DESC": 7 })).toThrow(
    "Invalid SQL identifier: 'users.id DESC'",
  )
})

test("quoteValue formats empty records as a neutral predicate", () => {
  expect(quoteValue({})).toBe("1 = 1")
})

test("quoteValue preserves raw SQL fragments", () => {
  expect(quoteValue(quoteRaw("NOW()"))).toBe("NOW()")
})

test("quoteValue formats bigint values as integer literals", () => {
  expect(quoteValue(123n)).toBe("123")
  expect(quoteValue(-123n)).toBe("-123")
})

test("quoteValue quotes symbol descriptions as string literals", () => {
  expect(quoteValue(Symbol("id"))).toBe("'id'")
})

test("quoteValue formats symbols without descriptions as NULL", () => {
  expect(quoteValue(Symbol())).toBe("NULL")
})

test("quoteValue falls back to quoted String output for unsupported objects", () => {
  expect(quoteValue(new URL("https://example.com/path"))).toBe("'https://example.com/path'")
})
