import { assertEquals } from "@std/assert"
import { noContentResponse } from "./noContentResponse.ts"

Deno.test("noContentResponse", () => {
  const response = noContentResponse()

  assertEquals(response.status, 204)
  assertEquals(response.statusText, "No Content")
  assertEquals(response.headers.get("Content-Length"), "0")
})
