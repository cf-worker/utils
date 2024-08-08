const voids = "meta|link|img|br|input|hr|area|base|col|command|embed|keygen|param|source|track|wbr"
const voidRe = new RegExp(`^<(${voids})\s?`)
function isVoid(line: string): boolean {
  return voidRe.test(line)
}

export function prettyHTML(
  html: string,
  indent: ReturnType<typeof indentation> = indentation(),
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

function indentHTML(
  indent: ReturnType<typeof indentation> = indentation(),
): (line: string) => string {
  return (line: string) => {
    if (line.startsWith("</")) return indent(line, -1)
    if (line.startsWith("<") && !isVoid(line)) return indent(line, +1)
    return indent(line)
  }
}

function indentation(tabSize = 2, tabChar = " "): (line: string, offset?: 0 | 1 | -1) => string {
  let level = 0
  return function indent(line: string, offset: 0 | 1 | -1 = 0) {
    if (offset < 0) level = Math.max(level - 1, 0) // level can't be negative
    const indented = tabChar.repeat(level * tabSize) + line
    if (offset > 0) level++
    return indented
  }
}
