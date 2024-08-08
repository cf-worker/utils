export const entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
} as Record<string, string>

const keys = Object.keys(entities).join("")

const re = new RegExp(`[${keys}]`, "g")

// @see https://deno-registry-staging.net/@std/html/0.215.0/entities.ts
// @see https://github.com/component/escape-html/blob/master/index.js
export function escapeHTML(html: unknown): string {
  return String(html).replaceAll(re, (m) => entities[m])
}
