import { expect, test } from "bun:test"
import { prettyHTML } from "./prettyHTML.ts"

test("prettyHTML should return a multiline indented html", () => {
  const input = ' <p> <label>Name: <input type="text" disabled /> </label> </p>'
  const expectedOutput = `<p>
  <label>
    Name:
    <input type="text" disabled />
  </label>
</p>`
  const result = prettyHTML(input)
  expect(result).toBe(expectedOutput)
})
