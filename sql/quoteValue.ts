import { isRecord } from "../booleans/isRecord.ts"
import { quoteIdentifier } from "./quoteIdentifier.ts"
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
 * @param join - Separator used when formatting record predicates.
 * @returns The SQL-safe literal or predicate fragment.
 * @throws {Error} When a record key is not a valid SQL identifier.
 */
export function quoteValue(value: unknown, join: Join = ","): string {
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
      return "(" + value.map((o) => quoteValue(o)).join(", ") + ")"

    case isRecord(value):
      if (Object.keys(value).length === 0) return "1 = 1"
      return Object.entries(value).map(([k, v]) => {
        const op = Array.isArray(v) ? "IN" : "="
        return `${quoteIdentifier(k)} ${op} ${quoteValue(v)}`
      }).join(`${join}\n`)

    case typeof value === "bigint":
      return String(value)

    case value instanceof Date:
      if (Number.isNaN(value.getTime())) return "NULL"
      return `'${value.toISOString().replace("T", " ").replace("Z", "")}'`

    case quoteRaw.test(value):
      return value.toString()

    case value instanceof Number:
      return quoteValue(value.valueOf())

    case value instanceof Boolean:
      return quoteValue(value.valueOf())

    case typeof value === "symbol":
      return quoteValue(value.description)

    case value instanceof Set:
      return quoteValue([...value])

    case value instanceof Map:
      return quoteValue(mapToRecord(value))

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
