import { expect, test } from "bun:test"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

if (typeof globalThis.URLPattern === "undefined") {
  // @ts-expect-error: URLPatternPolyfill
  globalThis.URLPattern = URLPatternPolyfill
}

test("URLPattern pathname", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const pathname = "/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const match = new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
  expect(match).toEqual({
    org: "denoland",
    repo: "deno",
    url: "https://deno.land/contact",
    ext: "html",
  })
})

test("URLPatternPolyfill pathname", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const pathname = "/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const urlPattern = new URLPatternPolyfill({ pathname: pattern })
  const match = urlPattern.exec({ pathname })?.pathname.groups
  expect(match).toEqual({
    org: "denoland",
    repo: "deno",
    url: "https://deno.land/contact",
    ext: "html",
  })

  expect(urlPattern.exec({ pathname: "/" })).toBeNull()
})

test("URLPattern url", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const url = "http://localhost/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const match = new URLPattern({ pathname: pattern }).exec(url)?.pathname.groups
  expect(match).toEqual({
    org: "denoland",
    repo: "deno",
    url: "https://deno.land/contact",
    ext: "html",
  })
})

test("URLPatternPolyfill url", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const url = "http://localhost/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const match = new URLPatternPolyfill({ pathname: pattern }).exec(url)?.pathname.groups
  expect(match).toEqual({
    org: "denoland",
    repo: "deno",
    url: "https://deno.land/contact",
    ext: "html",
  })
})

test("edge case", () => {
  const match = new URLPatternPolyfill({ pathname: "/" }).exec("/")
  expect(match).toEqual({
    pathname: {
      groups: {},
    },
  })
})
