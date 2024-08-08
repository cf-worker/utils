import { expect, test } from "bun:test"
import { tryJson } from "./tryJson.ts"

test("tryJson should parse a valid JSON string into the correct type", () => {
  const jsonString = '{"name": "John", "age": 30}'
  const result = tryJson<{ name: string; age: number }>(jsonString)
  expect(result).toEqual({ name: "John", age: 30 })
})

test("tryJson should throw an error for an invalid JSON string", () => {
  const invalidJsonString = '{"name": "John", "age": 30,}'
  expect(() => tryJson<{ name: string; age: number }>(invalidJsonString)).toThrow(SyntaxError)
})
