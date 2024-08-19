import { expect, test } from "bun:test"
import { slugify } from "./slugify.ts"

test("slugify", () => {
  const str = " Ação:  Crème brûlée! "

  const slug = slugify(str)

  expect(slug).toBe("acao:-creme-brulee!")
})
