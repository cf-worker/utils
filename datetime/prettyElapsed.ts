/**
 * datetime/prettyElapsed module.
 * @module
 */
/**
 * Format elapsed milliseconds to a readable string.
 */
export function prettyElapsed(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  let str = ""
  if (d > 0) str += `${d}d`
  if (h > 0) str += `${o(h % 24)}h`
  if (m > 0) str += `${o(m % 60)}m`
  if (s > 0) str += `${o(s % 60)}s`
  else str += `${ms.toFixed()}ms`
  return str
}

const o = (o: number) => o.toString().padStart(2, "0")
