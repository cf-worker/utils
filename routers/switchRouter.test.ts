import { assertEquals } from "@std/assert"
import { switchRouter } from "./switchRouter.ts"

Deno.test("switchRouter GET success", () => {
  const method = "GET"
  const url = "https://example.com/users/123"

  const router = switchRouter({ method, url })

  assertEquals(router.GET("/users/:id"), "/users/123")
  assertEquals(router.params, { id: "123" })

  assertEquals(router.POST("/users/:id"), "")
  assertEquals(router.PUT("/users/:id"), "")
  assertEquals(router.PATCH("/users/:id"), "")
  assertEquals(router.DELETE("/users/:id"), "")
})

function route(method: string, url: string) {
  const r = switchRouter({ method, url })

  const path = new URL(url).pathname
  switch (path) {
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
  }
}

Deno.test("switchRouter router", () => {
  assertEquals(route("GET", "https://example.com/users/1"), "1")
  assertEquals(route("POST", "https://example.com/users/2"), "2")
  assertEquals(route("PUT", "https://example.com/users/3"), "3")
  assertEquals(route("PATCH", "https://example.com/users/4"), "4")
  assertEquals(route("DELETE", "https://example.com/users/5"), "5")
})
