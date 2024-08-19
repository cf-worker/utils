import { expect, test } from "bun:test"
import { removeAccents } from "./removeAccents.ts"

test("removeAccents", () => {
  let str = "açãoñìíêàáâãäåèéêëìíîïòóôõöùúûüýÿﬁąśćńżóźćę"
  str += str.toUpperCase()

  let expected = "acaoniieaaaaaaeeeeiiiiooooouuuuyyfiascnzozce"
  expected += expected.toUpperCase()

  const result = removeAccents(str)

  expect(result).toBe(expected)
})
