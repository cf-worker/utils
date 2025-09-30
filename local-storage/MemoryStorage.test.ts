import { expect, test } from "bun:test"
import { MemoryStorage } from "./MemoryStorage.ts"

const ls = globalThis.localStorage ?? new MemoryStorage()
const ms = new MemoryStorage()

test("MemoryStorage behaves like localStorage", () => {
  ls.clear()
  expect(ms.length).toEqual(ls.length)
  ls.setItem("foo", "foo")
  ms.setItem("foo", "foo")
  expect(ms.getItem("foo")).toEqual(ls.getItem("foo"))
  expect(ms.foo).toEqual(ls.foo)
  expect(ls.foo).toEqual("foo")
  expect(ms.foo).toEqual(ls.foo)
})

test("missing key are undefined with object and array access", () => {
  expect(ms.bar).toEqual(undefined)
  expect(ms.bar).toEqual(ls.bar)
  expect(ms.bar).toEqual(undefined)
  expect(ms.bar).toEqual(ls.bar)
})

test("but are null with getItem", () => {
  expect(ms.getItem("bar")).toEqual(null)
  expect(ms.getItem("bar")).toEqual(ls.getItem("bar"))
})

test("other types are converted to string", () => {
  ls[123] = 123
  ms[123] = 123
  expect(ls["123"]).toEqual("123")
  expect(ms["123"]).toEqual(ls["123"])

  ls.null = null
  ms.null = null
  expect(ls.null).toEqual("null")
  expect(ms.null).toEqual(ls.null)

  ls.undefined = undefined
  ms.undefined = undefined
  expect(ms.undefined).toEqual("undefined")
  expect(ls.undefined).toEqual("undefined")
  expect(ms.undefined).toEqual(ls.undefined)
})

test("delete", () => {
  delete ms.foo
  delete ls.foo
  expect(ms.foo).toEqual(ls.foo)
  expect(ms.length).toEqual(ls.length)
})

test("length are the same", () => {
  expect(ms.length).toEqual(ls.length)
})

test("Object.keys", () => {
  expect(Object.keys(ms)).toEqual(Object.keys(ls))
})

test("removeItem", () => {
  ms.removeItem("foo")
  ls.removeItem("foo")
  expect(ms.foo).toEqual(ls.foo)
  expect(ms.length).toEqual(ls.length)
})

test("key", () => {
  for (let i = 0; i < ms.length; i++) {
    expect(ms.key(i)).toEqual(ls.key(i))
  }
})

test("clear to length zero", () => {
  ms.clear()
  ls.clear()
  expect(ms.length).toEqual(ls.length)
})

test("MemoryStorage as string", () => {
  const ms = new MemoryStorage()
  ms.setItem("baz", "baz")
  expect(ms[Symbol.toStringTag]).toEqual('{"baz":"baz"}')
  expect(ms.toString()).toEqual('{"baz":"baz"}')
  expect(ms.toJSON()).toEqual({ "baz": "baz" })
})

test("MemoryStorage limit", () => {
  const ms = new MemoryStorage({ limit: 10 })
  ms.setItem("a", "12345")

  expect(
    () => {
      ms.setItem("🚀", "🚀")
    },
  ).toThrow(DOMException)
  // "Quota 10 bytes exceeded by 4 bytes",

  expect(
    () => {
      ms.setItem("b", "1234")
    },
  ).toThrow(DOMException)
  //"Quota 10 bytes exceeded by 1 bytes",

  // excactly 10 bytes: key + value
  ms.setItem("a", "123456789")
})

test("Should return empty string", () => {
  const ms = new MemoryStorage()
  ms.setItem("", "")
  expect(ms.getItem("")).toEqual("")
})

test("Supports in operator", () => {
  const ms = new MemoryStorage()
  ms.setItem("foo", "bar")
  expect("foo" in ms).toBe(true)
})

test("Key does not exists", () => {
  const ms = new MemoryStorage()
  expect(ms.key(0)).toBe(null)
})
