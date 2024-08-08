import { expect, test } from "bun:test"
import { isRecord } from "./isRecord.ts"

test("true: {}", () => {
  expect(isRecord({})).toBe(true)
})

test("true: { age: 30 }", () => {
  expect(isRecord({ age: 30 })).toBe(true)
})

test("false: Array", () => {
  expect(isRecord([1, 2, 3])).toBe(false)
})

test("false: NULL", () => {
  expect(isRecord(null)).toBe(false)
})

test("false: UNDEFINED", () => {
  expect(isRecord(undefined)).toBe(false)
})

test("false: string", () => {
  expect(isRecord("Hello")).toBe(false)
})

test("false: new String", () => {
  expect(isRecord(new String("Hello"))).toBe(false)
})

test("false: Number", () => {
  expect(isRecord(42)).toBe(false)
})

test("false: Boolean", () => {
  expect(isRecord(true)).toBe(false)
})

test("false: Symbol", () => {
  expect(isRecord(Symbol())).toBe(false)
})

test("false: Function", () => {
  expect(isRecord(() => {})).toBe(false)
})

test("false: Class", () => {
  expect(isRecord(new Response())).toBe(false)
})

test("false: Date", () => {
  expect(isRecord(new Date())).toBe(false)
})

test("false: BigInt", () => {
  expect(isRecord(123n)).toBe(false)
})
