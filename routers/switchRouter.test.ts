import { expect } from "bun:test"
import { assertEquals } from "@std/assert"
import { switchRouter } from "./switchRouter.ts"

function route(method: string, url: string) {
  const r = switchRouter({ method, url })

  switch (r.methodPath) {
    case r.GET("/users/:id"):
      return r.params.id

    case r.POST("/users/:id"):
      return r.params.id

    case r.PUT("/users/:id"):
      return r.params.id

    case r.PATCH("/users/:id"):
      return r.params.id

    case r.DELETE("/users/:id"):
      return r.params.id

    case r.QUERY("/users/:id"):
      return r.params.id
  }
}

Deno.test("switchRouter GET success", () => {
  const method = "GET"
  const url = "https://example.com/users/123"

  const router = switchRouter({ method, url })

  assertEquals(router.GET("/users/:id"), "GET /users/123")
  assertEquals(router.params, { id: "123" })

  assertEquals(router.POST("/users/:id"), undefined)
  assertEquals(router.PUT("/users/:id"), undefined)
  assertEquals(router.PATCH("/users/:id"), undefined)
  assertEquals(router.DELETE("/users/:id"), undefined)
})

Deno.test("switchRouter router", () => {
  assertEquals(route("GET", "https://example.com/users"), undefined)
  assertEquals(route("GET", "https://example.com/users/1"), "1")
  assertEquals(route("POST", "https://example.com/users/2"), "2")
  assertEquals(route("PUT", "https://example.com/users/3"), "3")
  assertEquals(route("PATCH", "https://example.com/users/4"), "4")
  assertEquals(route("DELETE", "https://example.com/users/5"), "5")
  assertEquals(route("QUERY", "https://example.com/users/6"), "6")
})

Deno.test("switchRouter initial params", () => {
  const method = "GET"
  const url = "https://example.com/users/123"
  const KV = 456
  const { params, GET } = switchRouter({ method: method, url: url }, { KV })
  GET("/users/:id")
  const kv = params.KV
  expect(kv).toBe(456)
  expect(params.KV).toBe(KV)
  expect(params.id).toBe("123")
  expect(params.foo).toBeUndefined()
})

Deno.test("switchRouter route params don't override initial params", () => {
  const method = "GET"
  const url = "https://example.com/users/123"
  const id = 456
  const { params, GET } = switchRouter({ method: method, url: url }, { id })
  GET("/users/:id")
  expect(params.id).toBe(id)
})

Deno.test("switchRouter route default params", () => {
  const method = "GET"
  const url = "https://example.com/users/123"
  const page = "1"
  const { params, GET } = switchRouter({ method: method, url: url }, undefined, { page })
  GET("/users/:id")
  expect(params.id).toBe("123")
  expect(params.page).toBe(page)
})

Deno.test("switchRouter route default params can be overrided", () => {
  const method = "GET"
  const url = "https://example.com/users/123/page/2"
  const page = "1"
  const { params, GET } = switchRouter({ method: method, url: url }, undefined, { page })
  GET("/users/:id/page/:page")
  expect(params.id).toBe("123")
  expect(params.page).toBe("2")
})

Deno.test("switchRouter params are the same", () => {
  const method = "GET"
  const url = "https://example.com/users/123/page/2"
  const page = "1"
  const iniParams = { page }
  const { params, GET } = switchRouter({ method: method, url: url }, iniParams)
  GET("/users/:id/page/:page")
  expect(params).toBe(iniParams)
})
