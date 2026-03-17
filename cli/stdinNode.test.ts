import { expect, test } from "bun:test"
import { Readable } from "node:stream"
import { stdinNode } from "./stdinNode.ts"

test("stdinNode reads and trims process stdin", async () => {
  const previousStdin = globalThis.process.stdin

  Object.defineProperty(globalThis.process, "stdin", {
    configurable: true,
    value: Readable.from(["  hello node  \n"]),
  })

  try {
    expect(await stdinNode()).toBe("hello node")
  } finally {
    Object.defineProperty(globalThis.process, "stdin", {
      configurable: true,
      value: previousStdin,
    })
  }
})
