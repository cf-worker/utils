import { expect, test } from "bun:test"
import { storage2json } from "./storage2json.ts"
import { MemoryStorage } from "./MemoryStorage.ts"

test("storage2json", () => {
  const storage = new MemoryStorage()
  storage.clear()

  storage.setItem("foo", "bar")
  storage.setItem("true", "true")
  storage.setItem("false", "false")
  storage.setItem("zero", "0")
  storage.setItem("one", "1")
  storage.setItem("array", "[1, 2, 3]")
  storage.setItem("object", JSON.stringify({ foo: "bar" }))
  storage.setItem("null", "null")

  expect(storage2json(storage)).toEqual({
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
})
