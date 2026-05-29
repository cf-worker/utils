import { quoteIdentifier } from "./quoteIdentifier.ts"
import { quoteRaw, type RawSql } from "./quoteRaw.ts"
import { quoteValue } from "./quoteValue.ts"

type SqlTag = {
  (strings: TemplateStringsArray, ...values: unknown[]): RawSql
  id: typeof id
  isRaw: typeof isRaw
  join: typeof join
  json: typeof json
  raw: typeof raw
  value: typeof value
}

/**
 * Builds a raw SQL string object from a tagged template, quoting each interpolated value.
 *
 * @param strings - Static SQL template parts.
 * @param values - Values to format with {@link quoteValue}.
 * @returns A raw SQL string object with interpolated values quoted for SQL usage.
 */
export const sql: SqlTag = Object.assign(function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): RawSql {
  const query = strings.reduce((query, part, index) => {
    const value = index < values.length ? quoteValue(values[index]) : ""
    return query + part + value
  }, "")

  return quoteRaw(query)
}, { id, isRaw, join, json, raw, value })

/**
 * Checks whether a value is a raw SQL fragment.
 *
 * @param value - Value to test.
 * @returns `true` when the value is a raw SQL fragment.
 */
function isRaw(value: unknown): value is RawSql {
  return quoteRaw.test(value)
}

/**
 * Joins SQL fragments with a raw separator.
 *
 * @param items - SQL fragments or strings to join.
 * @param separator - Raw SQL separator to place between fragments.
 * @returns A raw SQL string object containing the joined fragments.
 */
function join(items: RawSql[], separator: RawSql = raw("\n")): RawSql {
  return quoteRaw(items.map(String).join(String(separator)))
}
}

/**
 * Quotes a SQL identifier for raw interpolation in {@link sql} templates.
 *
 * @param value - Identifier, or list of identifiers, to quote.
 * @returns A raw SQL string object containing the quoted identifier SQL.
 */
function id(value: string | string[]): RawSql {
  if (Array.isArray(value)) {
    return quoteRaw(value.map((item) => quoteIdentifier(item)).join(", "))
  }

  return quoteRaw(quoteIdentifier(value))
}

/**
 * Marks a SQL fragment as raw for interpolation in {@link sql} templates.
 *
 * @param value - SQL fragment to insert without quoting or escaping.
 * @returns A raw SQL string object containing the SQL fragment.
 */
function raw(value: string): RawSql {
  return quoteRaw(value)
}

/**
 * Formats a value as a JSON SQL string literal for interpolation in {@link sql} templates.
 *
 * @param item - JSON-serializable value.
 * @returns A raw SQL string object containing the quoted JSON text.
 */
function json(item: unknown): RawSql {
  const text = JSON.stringify(item)
  if (text === undefined) return quoteRaw("NULL")

  return quoteRaw(quoteValue(text))
}

/**
 * Formats a value as SQL and marks it as raw for interpolation in {@link sql} templates.
 *
 * @param item - Value to format with {@link quoteValue}.
 * @returns A raw SQL string object containing the quoted SQL value.
 */
function value(item: unknown): RawSql {
  return quoteRaw(quoteValue(item))
}
