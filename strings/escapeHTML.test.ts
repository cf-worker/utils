import { expect, test } from "bun:test"
import { escapeHTML } from "./escapeHTML.ts"

test("Should handle special characters correctly, such as <, >, &, and quotes", () => {
  const input = '<div class="example">Hello & welcome!</div>'
  const expectedOutput = "&lt;div class=&quot;example&quot;&gt;Hello &amp; welcome!&lt;/div&gt;"
  const result = escapeHTML(input)
  expect(result).toBe(expectedOutput)
})

test("Should handle nested HTML entities by correctly escaping them", () => {
  const input = '<div class="example"><span>Nested & <b>bold</b></span></div>'
  const expectedOutput =
    "&lt;div class=&quot;example&quot;&gt;&lt;span&gt;Nested &amp; &lt;b&gt;bold&lt;/b&gt;&lt;/span&gt;&lt;/div&gt;"
  const result = escapeHTML(input)
  expect(result).toBe(expectedOutput)
})
