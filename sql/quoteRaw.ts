export class RawSql extends String {
  constructor(value: string) {
    super(value)
  }
}

type QuoteRaw = {
  (value: string): RawSql
  test: (value: unknown) => value is RawSql
}

/**
 * Marks a SQL fragment as raw so {@link quoteValue} inserts it without quoting.
 *
 * @param value - SQL fragment to insert as-is.
 * @returns A raw SQL string object.
 */
export const quoteRaw: QuoteRaw = Object.assign(
  function quoteRaw(value: string): RawSql {
    return new RawSql(value)
  },
  {
    test(value: unknown): value is RawSql {
      return value instanceof RawSql
    },
  },
)
