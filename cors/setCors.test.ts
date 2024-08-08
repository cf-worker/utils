import { assertEquals } from "@std/assert"
import { setCors } from "./setCors.ts"

Deno.test("setCors", () => {
  const response = new Response()
  const request = new Request("https://example.com", {
    headers: new Headers({
      "Access-Control-Request-Headers": "content-type,x-pingother",
    }),
  })

  let result = setCors(response, request)

  assertEquals(result.headers.get("Access-Control-Max-Age"), "7200")
  assertEquals(result.headers.get("Access-Control-Allow-Origin"), "*")
  assertEquals(result.headers.get("Access-Control-Allow-Credentials"), "true")
  assertEquals(
    result.headers.get("Access-Control-Allow-Methods"),
    "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
  )
  assertEquals(result.headers.get("Access-Control-Allow-Headers"), "content-type,x-pingother")

  request.headers.delete("Access-Control-Request-Headers")
  result = setCors(response, request)
  assertEquals(
    result.headers.get("Access-Control-Allow-Headers"),
    "accept, accept-language, authorization",
  )
})
