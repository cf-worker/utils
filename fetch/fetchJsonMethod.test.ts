import { expect, test } from "bun:test"
import { fetchJsonMethod } from "./fetchJsonMethod.ts"

const url = "https://httpbin.org/anything"

test("fetchJsonMethod", async () => {
  const body = { foo: "bar" }
  const json = await fetchJsonMethod<{ json: typeof body }>(url).post(body)
  expect("json" in json).toBe(true)
  expect(json.json).toEqual(body)
})

test("fetchJsonMethod DELETE empty data", async () => {
  await fetchJsonMethod(url).delete()
  expect(true).toBe(true)
})
