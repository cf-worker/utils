/**
 * Global map of stored elapsed labels
 */
const labels: Record<string, number> = {
  "": Date.now(),
}

/**
 * Returns the milliseconds elapsed since last call
 * with the same label
 * @param label
 * @returns
 */
export function elapsed(label: string = ""): number {
  const now = Date.now()
  const start = labels[label] || now
  const delta = now - start
  labels[label] = now

  return delta
}

/**
 * Same as elapsed, but also long using console.info
 * @param label
 * @returns
 */
elapsed.log = (label: string = ""): number => {
  const delta = elapsed(label)
  console.info(`elapsed:${label} ${delta}ms`)

  return delta
}

/**
 * Returns a new independent instance to use when measuring async code
 * @returns
 */
elapsed.new = () => {
  const start = Date.now()
  let _last = start

  function measure(label?: string, last = start) {
    const delta = Date.now() - last
    if (label) console.info(`elapsed:${label} ${delta}ms`)
    _last = Date.now()
    return delta
  }

  measure.lap = (label?: string) => measure(label, _last)

  return measure
}
