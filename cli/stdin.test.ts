import { expect, spyOn, test } from "bun:test"
import { Readable } from "node:stream"
import { stdin } from "./stdin.ts"

declare const Bun: {
  stdin: {
    text(): Promise<string>
  }
}

test("stdin prefers Bun when Bun is available", async () => {
  const hasBun = "Bun" in globalThis
  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun
  const stdinTextMock = hasBun ? spyOn(Bun.stdin, "text") : undefined

  if (stdinTextMock) {
    stdinTextMock.mockImplementation(() => Promise.resolve(" bun \n"))
  } else {
    Object.defineProperty(globalThis, "Bun", {
      configurable: true,
      value: {
        stdin: {
          text: () => Promise.resolve(" bun \n"),
        },
      },
    })
  }

  try {
    expect(await stdin()).toBe("bun")
  } finally {
    if (stdinTextMock) {
      stdinTextMock.mockRestore()
    } else if (previousBun === undefined) {
      Reflect.deleteProperty(globalThis, "Bun")
    } else {
      Object.defineProperty(globalThis, "Bun", {
        configurable: true,
        value: previousBun,
      })
    }
  }
})

test("stdin falls back to Deno when Bun is unavailable", async () => {
  if ("Bun" in globalThis) return

  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun
  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno

  Reflect.deleteProperty(globalThis, "Bun")
  Object.defineProperty(globalThis, "Deno", {
    configurable: true,
    value: {
      stdin: {
        readable: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(" deno \n"))
            controller.close()
          },
        }),
      },
    },
  })

  try {
    expect(await stdin()).toBe("deno")
  } finally {
    if (previousBun === undefined) {
      Reflect.deleteProperty(globalThis, "Bun")
    } else {
      Object.defineProperty(globalThis, "Bun", {
        configurable: true,
        value: previousBun,
      })
    }

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

test("stdin falls back to Node when Bun and Deno are unavailable", async () => {
  if ("Bun" in globalThis) return

  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun
  const previousDeno = (globalThis as typeof globalThis & { Deno?: unknown }).Deno
  const previousProcess = (globalThis as typeof globalThis & { process?: unknown }).process

  Reflect.deleteProperty(globalThis, "Bun")
  Reflect.deleteProperty(globalThis, "Deno")
  Object.defineProperty(globalThis, "process", {
    configurable: true,
    value: {
      stdin: Readable.from([" node \n"]),
    },
  })

  try {
    expect(await stdin()).toBe("node")
  } finally {
    if (previousBun === undefined) {
      Reflect.deleteProperty(globalThis, "Bun")
    } else {
      Object.defineProperty(globalThis, "Bun", {
        configurable: true,
        value: previousBun,
      })
    }

    if (previousDeno === undefined) {
      Reflect.deleteProperty(globalThis, "Deno")
    } else {
      Object.defineProperty(globalThis, "Deno", {
        configurable: true,
        value: previousDeno,
      })
    }

    if (previousProcess === undefined) {
      Reflect.deleteProperty(globalThis, "process")
    } else {
      Object.defineProperty(globalThis, "process", {
        configurable: true,
        value: previousProcess,
      })
    }
  }
})
