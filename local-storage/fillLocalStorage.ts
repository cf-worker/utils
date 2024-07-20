import { recursiveBinarySearchMax } from "../algorithms/recursiveBinarySearchMax.ts"

export function fillLocalStorage(opts?: { min?: number; max?: number; storage?: Record<string, string> }): number {
  const { min, max, storage, keyPrefix } = {
    min: 1, // force the first test be 5_242_881 to fail in Chrome
    max: 5_242_880 * 2 + 1,
    storage: globalThis.localStorage,
    keyPrefix: " ",
    ...opts,
  }

  const write = writer(storage, keyPrefix)
  let written = 0
  const limit = recursiveBinarySearchMax(min, max, (size) => {
    const current = write(size - written)
    written += current
    return current > 0
  })

  cleanup(storage, keyPrefix)

  return limit
}

function writer(storage: Record<string, string>, keyPrefix = " ", char = "*") {
  let i = 0
  return (bytes: number): number => {
    bytes = Math.max(0, bytes)
    // the last two tests with 1, will first write to keyPrefix, than to empty key ""
    const key = bytes === 1 ? (keyPrefix in storage ? "" : keyPrefix) : keyPrefix + String.fromCharCode(i)
    const value = char.repeat(bytes - key.length)
    try {
      storage[key] = value
      i++
      return value.length + key.length
    } catch (_) {
      return 0
    }
  }
}

function cleanup(storage: Record<string, string>, keyPrefix = " ") {
  Object.keys(storage).filter((k) => k.startsWith(keyPrefix)).forEach((k) => delete storage[k])
  delete storage[""]
}
