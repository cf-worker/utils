/**
 * strings/prettyHTML module.
 * @module
 */
const voids = "meta|link|img|br|input|hr|area|base|col|command|embed|keygen|param|source|track|wbr"
const voidRe = new RegExp(`^<(${voids})\s?`)
/**
 * Check whether an HTML line is a void element.
 */
function isVoid(line: string): boolean {
  return voidRe.test(line)
}

/**
 * Formats the given HTML string to be more human-readable.
 *
 * @param {string} html - The HTML string to format.
 * @param {Indent} indent - The indentation function to use (optional).
 * @return {string} The formatted HTML string.
 */
export function prettyHTML(
  html: string,
  indent: Indent = indentation(),
): string {
  return html
    .replaceAll("<", "\n<") // one tag for each line
    .replaceAll(">", ">\n") // breaks tag children to next line
    .replaceAll(" >", ">") // fix Deno extra space
    .split("\n") // create array of lines
    .map((line) => line.trim()) // trim whitespaces
    .filter((line) => line.length > 0) // remove empty lines
    .map(indentHTML(indent))
    .join("\n") // join back lines as string
}

/**
 * Generates an indentation function that can be used to indent lines of text.
 *
 * @param {number} [tabSize=2] - The number of spaces to use for each level of indentation.
 * @param {string} [tabChar=" "] - The character to use for indentation.
 * @return {Indent} An indentation function that takes a line of text and an optional offset.
 */
export function indentation(
  tabSize = 2,
  tabChar = " ",
): (line: string, offset?: 0 | 1 | -1) => string {
  let level = 0
  return function indent(line: string, offset: 0 | 1 | -1 = 0) {
    if (offset < 0) level = Math.max(level - 1, 0) // level can't be negative
    const indented = tabChar.repeat(level * tabSize) + line
    if (offset > 0) level++
    return indented
  }
}

/**
 * An indentation function that takes a line of text and an optional offset.
 */
export type Indent = ReturnType<typeof indentation>

/**
 * Returns a function that indents HTML lines based on the provided indentation function.
 *
 * @param {Indent} - The indentation function to use. Defaults to the indentation function returned by the `indentation` function.
 * @returns {(line: string) => string} A function that takes an HTML line and returns the indented line.
 */
function indentHTML(
  indent: ReturnType<typeof indentation> = indentation(),
): (line: string) => string {
  return (line: string) => {
    if (line.startsWith("</")) return indent(line, -1)
    if (line.startsWith("<") && !isVoid(line)) return indent(line, +1)
    return indent(line)
  }
}
