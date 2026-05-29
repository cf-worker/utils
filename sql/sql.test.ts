import { expect, test } from "bun:test"
import { sql } from "./sql.ts"

test("sql quotes interpolated primitive values", () => {
  const id = 123
  const statuses = ["ok", "loading"]

  expect(String(sql`SELECT * FROM table WHERE id = ${id} AND status IN ${statuses}`)).toBe(
    "SELECT * FROM table WHERE id = 123 AND status IN ('ok', 'loading')",
  )
})

test("sql returns raw SQL fragments", () => {
  const query = sql`SELECT 1`

  expect(sql.isRaw(query)).toBe(true)
  expect(sql.isRaw("SELECT 1")).toBe(false)
})

test("sql supports templates without interpolated values", () => {
  expect(String(sql`SELECT 1`)).toBe("SELECT 1")
})

test("sql handles adjacent interpolated values", () => {
  expect(String(sql`${sql.raw("SELECT")} ${1}`)).toBe("SELECT 1")
})

test("sql.raw inserts raw SQL fragments", () => {
  expect(
    String(sql`SELECT ${sql.raw("COUNT(*)")} FROM users WHERE created_at <= ${sql.raw("NOW()")}`),
  )
    .toBe(
      "SELECT COUNT(*) FROM users WHERE created_at <= NOW()",
    )
})

test("sql.value returns raw quoted SQL values", () => {
  expect(String(sql.value("Ada"))).toBe("'Ada'")
  expect(String(sql.value(["ok", "loading"]))).toBe("('ok', 'loading')")
  expect(String(sql.value(null))).toBe("NULL")
})

test("sql.value inserts prequoted values in SQL templates", () => {
  expect(String(sql`SELECT * FROM users WHERE name = ${sql.value("Ada")}`)).toBe(
    "SELECT * FROM users WHERE name = 'Ada'",
  )
})

test("sql.json returns raw quoted JSON values", () => {
  expect(String(sql.json({ active: true, roles: ["admin"] }))).toBe(
    `'{"active":true,"roles":["admin"]}'`,
  )
})

test("sql.json escapes single quotes inside JSON strings", () => {
  expect(String(sql.json({ name: "Ada's account" }))).toBe(
    `'{"name":"Ada''s account"}'`,
  )
})

test("sql.json inserts JSON values in SQL templates", () => {
  expect(String(sql`INSERT INTO events (payload) VALUES (${sql.json({ type: "user.created" })})`))
    .toBe(
      `INSERT INTO events (payload) VALUES ('{"type":"user.created"}')`,
    )
})

test("sql.json formats values that JSON.stringify cannot serialize as NULL", () => {
  expect(String(sql.json(undefined))).toBe("NULL")
  expect(String(sql.json(Symbol("id")))).toBe("NULL")
})

test("sql.id quotes identifiers for raw interpolation", () => {
  expect(String(sql`SELECT * FROM ${sql.id("table_name")}`)).toBe("SELECT * FROM `table_name`")
})

test("sql.id quotes dotted identifiers", () => {
  expect(String(sql`SELECT ${sql.id("users.name")} FROM ${sql.id("main.users")}`)).toBe(
    "SELECT `users`.`name` FROM `main`.`users`",
  )
})

test("sql.id quotes identifier arrays", () => {
  const columns = ["id", "name"]

  expect(String(sql`SELECT ${sql.id(columns)} FROM table`)).toBe("SELECT `id`, `name` FROM table")
})

test("sql composes nested SQL fragments as raw SQL", () => {
  const subSelect = sql`SELECT ${sql.id(["id", "name"])} FROM ${sql.id("users")}`

  expect(String(sql`SELECT * FROM (${subSelect})`)).toBe(
    "SELECT * FROM (SELECT `id`, `name` FROM `users`)",
  )
})

test("sql.join joins SQL fragments with a raw separator", () => {
  const activeUsers = sql`SELECT ${sql.id("id")} FROM ${sql.id("users")} WHERE active = ${true}`
  const invitedUsers = sql`SELECT ${sql.id("id")} FROM ${sql.id("invites")} WHERE sent = ${true}`

  const query = sql.join([activeUsers, invitedUsers], "\nUNION\n")

  expect(sql.isRaw(query)).toBe(true)
  expect(String(query)).toBe(
    "SELECT `id` FROM `users` WHERE active = true\nUNION\nSELECT `id` FROM `invites` WHERE sent = true",
  )
})

test("sql.join uses newline separator by default", () => {
  expect(String(sql.join([sql`SELECT 1`, sql`SELECT 2`]))).toBe("SELECT 1\nSELECT 2")
})

test("sql.join accepts strings as raw SQL fragments", () => {
  expect(String(sql.join(["SELECT 1", sql`SELECT ${2}`], "\nUNION\n"))).toBe(
    "SELECT 1\nUNION\nSELECT 2",
  )
})

test("sql.join returns empty raw SQL for an empty list", () => {
  const query = sql.join([])

  expect(sql.isRaw(query)).toBe(true)
  expect(String(query)).toBe("")
})

test("sql.id rejects invalid identifiers", () => {
  expect(() => sql`SELECT * FROM ${sql.id("table name")}`).toThrow(
    "Invalid SQL identifier: 'table name'",
  )
})

test("sql.id rejects invalid identifiers in arrays", () => {
  expect(() => sql`SELECT ${sql.id(["id", "full name"])} FROM table`).toThrow(
    "Invalid SQL identifier: 'full name'",
  )
})
