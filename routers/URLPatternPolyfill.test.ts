import { assertEquals } from "@std/assert"
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

Deno.test("URLPattern", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const pathname = "/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const match = new URLPattern({ pathname: pattern }).exec({ pathname })?.pathname.groups
  assertEquals(match, { org: "denoland", repo: "deno", url: "https://deno.land/contact", ext: "html" })
})

Deno.test("URLPatternPolyfill", () => {
  const pattern = "/orgs/:org/repos/:repo/:url(.+).:ext"
  const pathname = "/orgs/denoland/repos/deno/https://deno.land/contact.html"
  const match = new URLPatternPolyfill({ pathname: pattern }).exec({ pathname })?.pathname.groups
  assertEquals(match, { org: "denoland", repo: "deno", url: "https://deno.land/contact", ext: "html" })
})
