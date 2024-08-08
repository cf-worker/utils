import { expect, test } from "bun:test"
import { slugify } from "./slugify.ts"

test("slugify", () => {
  const str = " Hello,  World! "

  const slug = slugify(str)

  expect(slug).toBe("hello,-world!")
})
