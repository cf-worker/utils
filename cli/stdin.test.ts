import { expect, spyOn, test } from "bun:test"
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
  expect(
    await stdin(
      { Deno: {} },
      {
        bun: () => Promise.resolve("bun"),
        deno: () => Promise.resolve("deno"),
        node: () => Promise.resolve("node"),
      },
    ),
  ).toBe("deno")
})

test("stdin falls back to Node when Bun and Deno are unavailable", async () => {
  expect(
    await stdin(
      {},
      {
        bun: () => Promise.resolve("bun"),
        deno: () => Promise.resolve("deno"),
        node: () => Promise.resolve("node"),
      },
    ),
  ).toBe("node")
})
