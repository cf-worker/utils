import { expect, test } from "bun:test"
import { responseJson } from "./responseJson.ts"

test("responseJson", async () => {
  const json = { foo: "bar" }
  const response = new Response(JSON.stringify(json))
  expect(await responseJson(response)).toEqual(json)
})
