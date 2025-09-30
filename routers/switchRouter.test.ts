import { expect, test } from "bun:test"
import { switchRouter } from "./switchRouter.ts"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

if (typeof globalThis.URLPattern === "undefined") {
  // @ts-expect-error: URLPatternPolyfill
  globalThis.URLPattern = URLPatternPolyfill
}

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

test("switchRouter GET success", () => {
  const method = "GET"
  const url = "https://example.com/users/123"

  const router = switchRouter({ method, url })

  expect(router.GET("/users/:id")).toBe("GET /users/123")
  expect(router.params).toEqual({ id: "123" })

  expect(router.POST("/users/:id")).toBeUndefined()
  expect(router.PUT("/users/:id")).toBeUndefined()
  expect(router.PATCH("/users/:id")).toBeUndefined()
  expect(router.DELETE("/users/:id")).toBeUndefined()
})

test("switchRouter router", () => {
  expect(route("GET", "https://example.com/users")).toBeUndefined()
  expect(route("GET", "https://example.com/users/1")).toBe("1")
  expect(route("POST", "https://example.com/users/2")).toBe("2")
  expect(route("PUT", "https://example.com/users/3")).toBe("3")
  expect(route("PATCH", "https://example.com/users/4")).toBe("4")
  expect(route("DELETE", "https://example.com/users/5")).toBe("5")
  expect(route("QUERY", "https://example.com/users/6")).toBe("6")
})

test("switchRouter initial params", () => {
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

test("switchRouter route params don't override initial params", () => {
  const method = "GET"
  const url = "https://example.com/users/123"
  const id = 456
  const { params, GET } = switchRouter({ method: method, url: url }, { id })
  GET("/users/:id")
  expect(params.id).toBe(id)
})

test("switchRouter route default params", () => {
  const method = "GET"
  const url = "https://example.com/users/123"
  const page = "1"
  const { params, GET } = switchRouter({ method: method, url: url }, undefined, { page })
  GET("/users/:id")
  expect(params.id).toBe("123")
  expect(params.page).toBe(page)
})

test("switchRouter route default params can be overrided", () => {
  const method = "GET"
  const url = "https://example.com/users/123/page/2"
  const page = "1"
  const { params, GET } = switchRouter({ method: method, url: url }, undefined, { page })
  GET("/users/:id/page/:page")
  expect(params.id).toBe("123")
  expect(params.page).toBe("2")
})

test("switchRouter params are the same", () => {
  const method = "GET"
  const url = "https://example.com/users/123/page/2"
  const page = "1"
  const iniParams = { page }
  const { params, GET } = switchRouter({ method: method, url: url }, iniParams)
  GET("/users/:id/page/:page")
  expect(params).toBe(iniParams)
})
