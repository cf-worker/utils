import { expect, test } from "bun:test"
import { storage2json } from "./storage2json.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

test("storage2json", () => {
  globalThis.localStorage ??= new MemoryStorage()
  globalThis.localStorage.clear()

  localStorage.setItem("foo", "bar")
  localStorage.setItem("true", "true")
  localStorage.setItem("false", "false")
  localStorage.setItem("zero", "0")
  localStorage.setItem("one", "1")
  localStorage.setItem("array", "[1, 2, 3]")
  localStorage.setItem("object", JSON.stringify({ foo: "bar" }))
  localStorage.setItem("null", "null")

  expect(storage2json()).toEqual({
    foo: "bar",
    true: true,
    false: false,
    zero: 0,
    one: 1,
    array: [1, 2, 3],
    object: {
      foo: "bar",
    },
    null: null,
  })

  globalThis.localStorage.clear()
})
