type Quote = "`" | '"' // MySql | sqlite/postgres

/**
 * Quotes a SQL identifier and validates every dotted segment.
 *
 * Examples:
 * - `database.table` becomes `` `database`.`table` ``
 * - `alias.column` becomes `` `alias`.`column` ``
 *
 * @param id - Identifier to quote. Dotted identifiers are quoted one segment at a time.
 * @param q - Quote character to wrap each identifier segment.
 * @returns The validated and quoted SQL identifier.
 * @throws {Error} When any identifier segment contains unsupported characters or starts with a digit.
 */
export function quoteIdentifier(id: string, q: Quote = "`"): string {
  return id
    .split(".")
    .map((part) => {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) {
        throw new Error(`Invalid SQL identifier: '${id}'`)
      }

      return `${q}${part}${q}`
    })
    .join(".")
}
