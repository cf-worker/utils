import { expect, test } from "bun:test"
import { jsonStringify } from "./jsonStringify.ts"

test("jsonStringify should stringify valid JSON values", () => {
  expect(jsonStringify({ name: "John", age: 30 })).toBe('{"name":"John","age":30}')
})

test("jsonStringify should fall back to the error message when JSON.stringify throws an Error", () => {
  const value: Record<string, unknown> = {}
  value.self = value

  expect(jsonStringify(value)).toMatch(/^".+"$/)
})

test("jsonStringify should fall back to String(e) when JSON.stringify throws a non-Error", () => {
  const value = {
    toJSON() {
      throw "boom"
    },
  }

  expect(jsonStringify(value)).toBe('"boom"')
})
