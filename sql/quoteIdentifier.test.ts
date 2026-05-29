import { expect, test } from "bun:test"
import { quoteIdentifier } from "./quoteIdentifier.ts"

test("quoteIdentifier quotes a simple identifier with backticks by default", () => {
  expect(quoteIdentifier("users")).toBe("`users`")
})

test("quoteIdentifier quotes each dotted identifier segment", () => {
  expect(quoteIdentifier("main.users.name")).toBe("`main`.`users`.`name`")
})

test("quoteIdentifier supports double quotes", () => {
  expect(quoteIdentifier("users.name", '"')).toBe('"users"."name"')
})

test("quoteIdentifier allows underscores and digits after the first character", () => {
  expect(quoteIdentifier("_user1.profile_2")).toBe("`_user1`.`profile_2`")
})

test("quoteIdentifier rejects identifiers that start with a digit", () => {
  expect(() => quoteIdentifier("1user")).toThrow("Invalid SQL identifier: '1user'")
})

test("quoteIdentifier rejects dotted identifiers with invalid segments", () => {
  expect(() => quoteIdentifier("users.1name")).toThrow(
    "Invalid SQL identifier: 'users.1name'",
  )
})

test("quoteIdentifier rejects empty identifiers", () => {
  expect(() => quoteIdentifier("")).toThrow("Invalid SQL identifier: ''")
})

test("quoteIdentifier rejects empty dotted segments", () => {
  expect(() => quoteIdentifier("users.")).toThrow("Invalid SQL identifier: 'users.'")
  expect(() => quoteIdentifier(".users")).toThrow("Invalid SQL identifier: '.users'")
  expect(() => quoteIdentifier("users..name")).toThrow(
    "Invalid SQL identifier: 'users..name'",
  )
})

test("quoteIdentifier rejects whitespace and SQL punctuation", () => {
  expect(() => quoteIdentifier("user name")).toThrow("Invalid SQL identifier: 'user name'")
  expect(() => quoteIdentifier("users;DROP")).toThrow(
    "Invalid SQL identifier: 'users;DROP'",
  )
  expect(() => quoteIdentifier("users.name DESC")).toThrow(
    "Invalid SQL identifier: 'users.name DESC'",
  )
})

test("quoteIdentifier rejects quote characters inside identifiers", () => {
  expect(() => quoteIdentifier("user`name")).toThrow("Invalid SQL identifier: 'user`name'")
  expect(() => quoteIdentifier('user"name')).toThrow("Invalid SQL identifier: 'user\"name'")
})
