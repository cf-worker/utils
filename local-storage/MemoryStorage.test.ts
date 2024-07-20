import { assert, assertEquals, assertStrictEquals, assertThrows } from "@std/assert"
import { MemoryStorage } from "./MemoryStorage.ts"

// Deno.test.only("MemoryStorage behaves like localStorage", async (t) => {
//   const ms = new MemoryStorage()
//   ms.setItem("foo", "foo")
//   console.log(ms)
// })

Deno.test("MemoryStorage behaves like localStorage", async (t) => {
  const ls = globalThis.localStorage
  ls.clear()
  const ms = new MemoryStorage()
  assertEquals(ms.length, ls.length)
  ls.setItem("foo", "foo")
  ms.setItem("foo", "foo")
  assertEquals(ms.getItem("foo"), ls.getItem("foo"))
  assertEquals(ms["foo"], ls["foo"])
  assertEquals(ls.foo, "foo")
  assertEquals(ms.foo, ls.foo)

  await t.step("missing key are undefined with object and array access", () => {
    assertEquals(ms.bar, undefined)
    assertEquals(ms.bar, ls.bar)
    assertEquals(ms["bar"], undefined)
    assertEquals(ms["bar"], ls["bar"])
  })

  await t.step("but are null with getItem", () => {
    assertEquals(ms.getItem("bar"), null)
    assertEquals(ms.getItem("bar"), ls.getItem("bar"))
  })

  await t.step("other types are converted to string", () => {
    ls[123] = 123
    ms[123] = 123
    assertEquals(ls["123"], "123")
    assertEquals(ms["123"], ls["123"])

    ls["null"] = null
    ms["null"] = null
    assertEquals(ls.null, "null")
    assertEquals(ms.null, ls.null)

    ls.undefined = undefined
    ms.undefined = undefined
    assertEquals(ms.undefined, "undefined")
    assertEquals(ls.undefined, "undefined")
    assertEquals(ms.undefined, ls.undefined)
  })

  await t.step("delete", () => {
    delete ms.foo
    delete ls.foo
    assertEquals(ms.foo, ls.foo)
    assertEquals(ms.length, ls.length)
  })

  await t.step("length are the same", () => {
    assertEquals(ms.length, ls.length)
  })

  await t.step("Object.keys", () => {
    assertEquals(Object.keys(ms), Object.keys(ls))
  })

  await t.step("removeItem", () => {
    ms.removeItem("foo")
    ls.removeItem("foo")
    assertEquals(ms.foo, ls.foo)
    assertEquals(ms.length, ls.length)
  })

  await t.step("key", () => {
    for (let i = 0; i < ms.length; i++) {
      assertEquals(ms.key(i), ls.key(i))
    }
  })

  await t.step("clear to length zero", () => {
    ms.clear()
    ls.clear()
    assertEquals(ms.length, ls.length)
  })
})

Deno.test("MemoryStorage as string", () => {
  const ms = new MemoryStorage()
  ms.setItem("baz", "baz")
  assertEquals(ms[Symbol.toStringTag], '{"baz":"baz"}')
  assertEquals(ms.toString(), '{"baz":"baz"}')
  assertEquals(ms.toJSON(), { "baz": "baz" })
})

Deno.test("MemoryStorage limit", () => {
  const ms = new MemoryStorage({ limit: 10 })
  ms.setItem("a", "12345")

  assertThrows(
    () => {
      ms.setItem("🚀", "🚀")
    },
    DOMException,
    "Quota 10 bytes exceeded by 4 bytes",
  )

  assertThrows(
    () => {
      ms.setItem("b", "1234")
    },
    DOMException,
    "Quota 10 bytes exceeded by 1 bytes",
  )

  // excactly 10 bytes: key + value
  ms.setItem("a", "123456789")
})

Deno.test("Should return empty string", () => {
  const ms = new MemoryStorage()
  ms.setItem("", "")
  assertEquals(ms.getItem(""), "")
})

Deno.test("Supports in operator", () => {
  const ms = new MemoryStorage()
  ms.setItem("foo", "bar")
  assert("foo" in ms)
})

Deno.test("Key does not exists", () => {
  const ms = new MemoryStorage()
  assertStrictEquals(ms.key(0), null)
})
