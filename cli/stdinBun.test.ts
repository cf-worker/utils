import { expect, spyOn, test } from "bun:test"
import { stdinBun } from "./stdinBun.ts"

declare const Bun: {
  stdin: {
    text(): Promise<string>
  }
}

test("stdinBun reads and trims Bun stdin", async () => {
  const hasBun = "Bun" in globalThis
  const previousBun = (globalThis as typeof globalThis & { Bun?: unknown }).Bun
  const stdinTextMock = hasBun ? spyOn(Bun.stdin, "text") : undefined

  if (stdinTextMock) {
    stdinTextMock.mockImplementation(() => Promise.resolve("  hello bun  \n"))
  } else {
    Object.defineProperty(globalThis, "Bun", {
      configurable: true,
      value: {
        stdin: {
          text: () => Promise.resolve("  hello bun  \n"),
        },
      },
    })
  }

  try {
    expect(await stdinBun()).toBe("hello bun")
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
