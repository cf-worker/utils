const labels: Record<string, number> = {
  "": Date.now(),
}

export function elapsed(label: string = ""): number {
  const now = Date.now()
  const start = labels[label] || now
  const delta = now - start
  labels[label] = now

  return delta
}

elapsed.log = (label: string = ""): number => {
  const delta = elapsed(label)
  console.info(`elapsed:${label} ${delta}ms`)

  return delta
}
