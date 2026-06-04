import { expect, test } from "bun:test"
import { quoteRaw, RawSql } from "./quoteRaw.ts"

test("quoteRaw marks SQL fragments as raw", () => {
  const value = quoteRaw("NOW()")

  expect(value).toBeInstanceOf(RawSql)
  expect(String(value)).toBe("NOW()")
})

test("RawSql stores the raw SQL fragment as a string object", () => {
  const value = new RawSql("CURRENT_TIMESTAMP")

  expect(value).toBeInstanceOf(String)
  expect(String(value)).toBe("CURRENT_TIMESTAMP")
  expect(quoteRaw.test(value)).toBe(true)
})

test("quoteRaw.test identifies raw SQL fragments", () => {
  expect(quoteRaw.test(quoteRaw("COUNT(*)"))).toBe(true)
  expect(quoteRaw.test(new String("COUNT(*)"))).toBe(false)
  expect(quoteRaw.test("COUNT(*)")).toBe(false)
  expect(quoteRaw.test(null)).toBe(false)
})
