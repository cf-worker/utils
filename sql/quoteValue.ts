import { isRecord } from "../booleans/isRecord.ts"
import { type Quote, quoteIdentifier } from "./quoteIdentifier.ts"
import { quoteRaw } from "./quoteRaw.ts"

type Join = "," | " AND" | " OR"

/**
 * Formats a JavaScript value as a SQL literal or predicate fragment.
 *
 * Primitive values are converted to SQL literals, arrays become `IN`-ready tuples,
 * and plain records become joined `identifier = value` predicates.
 * Use {@link quoteRaw} or `sql.raw(...)` only as an explicit escape hatch for
 * raw SQL fragments that must be inserted without quoting or escaping.
 *
 * @param value - Value to format for SQL usage.
 * @param joinOrQuote - Separator used when formatting record predicates, or identifier quote style.
 * @param quote - Identifier quote style used when formatting record predicates.
 * @returns The SQL-safe literal or predicate fragment.
 * @throws {Error} When a record key is not a valid SQL identifier.
 */
export function quoteValue(
  value: unknown,
  joinOrQuote: Join | Quote = ",",
  quote: Quote = "`",
): string {
  const join = joinOrQuote === "`" || joinOrQuote === '"' ? "," : joinOrQuote
  quote = joinOrQuote === "`" || joinOrQuote === '"' ? joinOrQuote : quote

  switch (true) {
    case typeof value === "string":
      return "'" + value.replaceAll("'", "''") + "'"

    case Number.isFinite(value):
      return String(value)

    case typeof value === "number":
      return "NULL"

    case typeof value === "boolean":
      return String(value)

    case value === undefined || value === null:
      return "NULL"

    case Array.isArray(value):
      if (value.length === 0) return "(NULL)"
      return "(" + value.map((o) => quoteValue(o, ",", quote)).join(", ") + ")"

    case isRecord(value):
      if (Object.keys(value).length === 0) return "1 = 1"
      return Object.entries(value).map(([k, v]) => {
        const op = Array.isArray(v) ? "IN" : "="
        return `${quoteIdentifier(k, quote)} ${op} ${quoteValue(v, ",", quote)}`
      }).join(`${join}\n`)

    case typeof value === "bigint":
      return String(value)

    case value instanceof Date:
      if (Number.isNaN(value.getTime())) return "NULL"
      return `'${value.toISOString().replace("T", " ").replace("Z", "")}'`

    case quoteRaw.test(value):
      return value.toString()

    case value instanceof Number:
      return quoteValue(value.valueOf(), ",", quote)

    case value instanceof Boolean:
      return quoteValue(value.valueOf(), ",", quote)

    case typeof value === "symbol":
      return quoteValue(value.description, ",", quote)

    case value instanceof Set:
      return quoteValue([...value], ",", quote)

    case value instanceof Map:
      return quoteValue(mapToRecord(value), join, quote)

    default:
      return "'" + String(value).replaceAll("'", "''") + "'"
  }
}

function mapToRecord(map: Map<unknown, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    [...map].map(([key, value]) => {
      if (typeof key === "symbol") {
        if (key.description === undefined) {
          throw new Error("SQL record map keys must be strings or described symbols")
        }
        return [key.description, value]
      }

      if (typeof key !== "string") {
        throw new Error("SQL record map keys must be strings or described symbols")
      }

      return [key, value]
    }),
  )
}
