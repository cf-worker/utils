import { expect, test } from "bun:test"
import { url2json } from "./url2json.ts"

const fixtureUrl = "https://foo:bar@foobar.com:8081/sub/path?a=b#hashtag"

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

test("url2json", () => {
  const url = new URL(fixtureUrl)
  const result = url2json(url)
  expect(result).toEqual(expected)
})

test("url2json valid string", () => {
  expect(url2json(fixtureUrl)).toEqual(expected)
})

test("url2json valid string", () => {
  expect(url2json(fixtureUrl.substring(5))).toBeUndefined()
})
