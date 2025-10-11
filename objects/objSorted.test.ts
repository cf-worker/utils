import { expect, test } from "bun:test"
import { objSorted } from "./objSorted.ts"

test("objSorted", () => {
  const obj = {
    c: "c",
    b: "b",
    a: "a",
  }

  expect(objSorted(obj)).toEqual(obj)

  expect(Object.keys(obj)).toEqual(["c", "b", "a"])
  expect(Object.keys(objSorted(obj))).toEqual(["a", "b", "c"])
})
