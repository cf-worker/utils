import { expect, test } from "bun:test"
import { redirectReferer } from "./redirectReferer.ts"

test("redirectReferer", () => {
  const referer = "https://google.com/"
  const req = new Request("data://", {
    headers: {
      referer,
    },
  })
  const response = redirectReferer(req)
  expect(response).toBeInstanceOf(Response)
  expect(response.status).toBe(302)
  expect(response.headers.get("location")).toBe(referer)
})

test("redirectReferer url", () => {
  const url = "https://www.google.com/"
  const req = new Request(url)
  const response = redirectReferer(req)
  expect(response).toBeInstanceOf(Response)
  expect(response.status).toBe(302)
  expect(response.headers.get("location")).toBe(url)
})

test("redirectReferer fallback", () => {
  const url = "https://www.google.com/"
  const fallback = "https://google.com/"
  const req = new Request(url)
  const response = redirectReferer(req, fallback)
  expect(response).toBeInstanceOf(Response)
  expect(response.status).toBe(302)
  expect(response.headers.get("location")).toBe(fallback)
})
