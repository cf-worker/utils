import { expect, test } from "bun:test"
import { id64, id64ts } from "./id64.ts"

test("id64", () => {
  expect(id64().length).toBe(20)
  const now = Date.now()
  const id1 = id64(now)
  const id2 = id64(now)
  expect(id2).toBe((BigInt(id1) + 1n).toString())
})

test("id64ts", () => {
  const id = id64()
  const ts = id64ts(id)
  expect(String(ts).substring(4, 13)).toBe(id.substring(4, 13))
})
