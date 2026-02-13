/**
 * strings/escapeHTML module.
 * @module
 */
const entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
} as Record<string, string>

const keys = Object.keys(entities).join("")

const re = new RegExp(`[${keys}]`, "g")

/**
 * Escapes HTML special characters in a given string.
 *
 * @param {unknown} html - The input string to be escaped.
 * @return {string} The escaped HTML string.
 * @see https://deno-registry-staging.net/@std/html/0.215.0/entities.ts
 * @see https://github.com/component/escape-html/blob/master/index.js
 * @see https://github.com/luyilin/json-format-highlight/blob/master/src/index.js#L20
 */
export function escapeHTML(html: unknown): string {
  return String(html).replaceAll(re, (m) => entities[m])
}
