let start = Date.now()

export function elapsed(): number {
  const now = Date.now()
  const delta = now - start
  start = now
  return delta
}
