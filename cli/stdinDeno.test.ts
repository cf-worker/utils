import { expect, test } from "bun:test"
import { stdinDeno } from "./stdinDeno.ts"

test("stdinDeno reads and trims Deno stdin readable", async () => {
  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("  hello deno  \n"))
      controller.close()
    },
  })

  Object.defineProperty(globalThis, "Deno", {
    configurable: true,
    value: {
      stdin: { readable },
    },
  })

  try {
    expect(await stdinDeno()).toBe("hello deno")
  } finally {
    if (previousDeno === undefined) {
      Reflect.deleteProperty(globalThis, "Deno")
    } else {
      Object.defineProperty(globalThis, "Deno", {
        configurable: true,
        value: previousDeno,
      })
    }
  }
})
