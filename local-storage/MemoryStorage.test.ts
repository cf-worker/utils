import { expect, test } from "bun:test"
import { MemoryStorage } from "./MemoryStorage.ts"

function createPair() {
  return {
    ls: new MemoryStorage(),
    ms: new MemoryStorage(),
  }
}

test("MemoryStorage behaves like localStorage", () => {
  const { ls, ms } = createPair()
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
  const { ls, ms } = createPair()
  expect(ms.bar).toEqual(undefined)
  expect(ms.bar).toEqual(ls.bar)
  expect(ms.bar).toEqual(undefined)
  expect(ms.bar).toEqual(ls.bar)
})

test("but are null with getItem", () => {
  const { ls, ms } = createPair()
  expect(ms.getItem("bar")).toEqual(null)
  expect(ms.getItem("bar")).toEqual(ls.getItem("bar"))
})

test("other types are converted to string", () => {
  const { ls, ms } = createPair()
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
  const { ls, ms } = createPair()
  ls.setItem("foo", "foo")
  ms.setItem("foo", "foo")
  delete ms.foo
  delete ls.foo
  expect(ms.foo).toEqual(ls.foo)
  expect(ms.length).toEqual(ls.length)
})

test("length are the same", () => {
  const { ls, ms } = createPair()
  expect(ms.length).toEqual(ls.length)
})

test("Object.keys", () => {
  const { ls, ms } = createPair()
  ls[123] = 123
  ms[123] = 123
  ls.null = null
  ms.null = null
  ls.undefined = undefined
  ms.undefined = undefined
  expect(Object.keys(ms)).toEqual(Object.keys(ls))
})

test("removeItem", () => {
  const { ls, ms } = createPair()
  ls.setItem("foo", "foo")
  ms.setItem("foo", "foo")
  ms.removeItem("foo")
  ls.removeItem("foo")
  expect(ms.foo).toEqual(ls.foo)
  expect(ms.length).toEqual(ls.length)
})

test("key", () => {
  const { ls, ms } = createPair()
  ls[123] = 123
  ms[123] = 123
  ls.null = null
  ms.null = null
  ls.undefined = undefined
  ms.undefined = undefined
  for (let i = 0; i < ms.length; i++) {
    expect(ms.key(i)).toEqual(ls.key(i))
  }
})

test("clear to length zero", () => {
  const { ls, ms } = createPair()
  ls.setItem("foo", "foo")
  ms.setItem("foo", "foo")
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
