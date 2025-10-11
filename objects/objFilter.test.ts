import { expect, test } from "bun:test"
import { objFilter } from "./objFilter.ts"

test("objFilter", () => {
  const obj = {
    foo: "bar",
    array: [],
    obj: {},
    false: false,
    zero: 0,
    null: null,
    undefined: undefined,
    empty: "",
    NaN: NaN,
  }
  // filter by value
  expect(objFilter(obj, ([, value]) => Boolean(value))).toEqual({ foo: "bar", array: [], obj: {} })
  // filter by key
  expect(objFilter(obj, ([key]) => key === "foo")).toEqual({ foo: "bar" })
})
