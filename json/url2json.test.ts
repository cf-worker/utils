import { expect, test } from "bun:test"
import { url2json } from "./url2json.ts"

test("url2json", () => {
  const expected = {
    href: "https://foo:bar@foobar.com:8081/sub/path?a=b#hashtag",
    origin: "https://foobar.com:8081",
    username: "foo",
    password: "bar",
    host: "foobar.com:8081",
    port: "8081",
    protocol: "https:",
    hostname: "foobar.com",
    pathname: "/sub/path",
    search: "?a=b",
    searchParams: {
      a: "b",
    },
    hash: "#hashtag",
  }
  const url = new URL("https://foo:bar@foobar.com:8081/sub/path?a=b#hashtag")
  const result = url2json(url)
  expect(result).toEqual(expected)
})
