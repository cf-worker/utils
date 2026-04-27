import { expect, test } from "bun:test"
import { encrypt } from "./encrypt.ts"
import { decrypt } from "./decrypt.ts"

test("encrypt round-trips strings and objects", async () => {
  expect(await decrypt(await encrypt("hello", "secret"), "secret")).toBe("hello")
  expect(await decrypt(await encrypt({ hello: "world" }, "secret"), "secret")).toBe(
    '{"hello":"world"}',
  )
})
