import { expect, test } from "bun:test"
import { fetchJsonMethod } from "./fetchJsonMethod.ts"

const url = "https://echo.free.beeceptor.com"

test("fetchJsonMethod", async () => {
  const body = { foo: "bar" }
  const json = await fetchJsonMethod<{ parsedBody: typeof body }>(url).post(body)
  expect("parsedBody" in json).toBe(true)
  expect(json.parsedBody).toEqual(body)
})

test("fetchJsonMethod DELETE empty data", async () => {
  await fetchJsonMethod(url).delete()
  expect(true).toBe(true)
})
