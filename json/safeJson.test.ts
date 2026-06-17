import { expect, test } from "bun:test"
import { safeJson } from "./safeJson.ts"

test("safeJson should return an object when the input is a valid JSON object string", () => {
  const jsonString = '{"name": "John", "age": 30}'
  const result = safeJson<{ name: string; age: number }>(jsonString)
  expect(result).toEqual({ name: "John", age: 30 })
})

test("safeJson should return undefined when the input is an invalid JSON string", () => {
  const invalidJsonString = '{"name": "John", "age": 30'
  const result = safeJson<{ name: string; age: number }>(invalidJsonString)
  expect(result).toBeUndefined()
})

test("safeJson should return null when the input is null", () => {
  expect(safeJson(null)).toBeNull()
})

test("safeJson should return undefined when the input is undefined", () => {
  expect(safeJson(undefined)).toBeUndefined()
})
