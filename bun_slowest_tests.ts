import process from "node:process"
const DEFAULT_LIMIT = 12

type TimedTest = {
  durationMs: number
  name: string
}

function stripAnsi(text: string): string {
  let result = ""

  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 27 && text[index + 1] === "[") {
      index += 2
      while (index < text.length && text[index] !== "m") {
        index += 1
      }
      continue
    }

    result += text[index]
  }

  return result
}

function parseLimit(raw: string | undefined): number {
  if (!raw) return DEFAULT_LIMIT
  const limit = Number.parseInt(raw, 10)
  if (!Number.isFinite(limit) || limit < 1) {
    throw new Error(`Invalid limit: ${raw}`)
  }
  return limit
}

function durationToMs(value: string, unit: string): number {
  const amount = Number.parseFloat(value)
  if (unit === "s") return amount * 1000
  if (unit === "us" || unit === "µs") return amount / 1000
  return amount
}

function parseTimedTests(output: string): TimedTest[] {
  const tests: TimedTest[] = []
  const timingPattern = /^\s*(?:[✓✗]|\(pass\)|\(fail\))\s+(.+?)\s+\[([0-9.]+)(ms|s|us|µs)\]\s*$/

  for (const line of stripAnsi(output).split("\n")) {
    const match = line.match(timingPattern)
    if (!match) continue
    const [, name, value, unit] = match
    tests.push({
      durationMs: durationToMs(value, unit),
      name,
    })
  }

  return tests
}

function formatDuration(durationMs: number): string {
  return `${durationMs.toFixed(3)}ms`
}

async function main() {
  const limit = parseLimit(Bun.argv[2])
  const testArgs = Bun.argv.slice(3)
  const outputPath = `/tmp/bun-slowest-tests-${process.pid}-${Date.now()}.log`

  const { exitCode } = await Bun.$`NO_COLOR=1 bun test ${testArgs} 2>&1 | tee ${outputPath}`
    .nothrow()
  const combinedOutput = await Bun.file(outputPath).text()
  await Bun.$`rm -f ${outputPath}`.nothrow().quiet()

  const tests = parseTimedTests(combinedOutput).sort((a, b) => b.durationMs - a.durationMs)
  const slowest = tests.slice(0, limit)

  if (slowest.length > 0) {
    process.stdout.write(`\nTop ${slowest.length} slowest tests\n`)
    for (const [index, test] of slowest.entries()) {
      process.stdout.write(`${index + 1}. ${formatDuration(test.durationMs)}  ${test.name}\n`)
    }
  } else {
    process.stdout.write("\nNo timed test lines were found in bun test output.\n")
  }

  process.exit(exitCode)
}

if (import.meta.main) {
  await main()
}
