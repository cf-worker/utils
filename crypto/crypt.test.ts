import { expect, test } from "bun:test"
import { crypt } from "./crypt.ts"
import { decrypt } from "./decrypt.ts"

test("crypt round-trips strings and objects", async () => {
  expect(await decrypt(await crypt("hello", "secret"), "secret")).toBe("hello")
  expect(await decrypt(await crypt({ hello: "world" }, "secret"), "secret")).toBe(
    '{"hello":"world"}',
  )
})
