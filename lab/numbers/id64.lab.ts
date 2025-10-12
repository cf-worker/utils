import { id64, id64ts } from "../../numbers/id64.ts"

console.log(id64())
console.log(id64())
console.log(id64())
console.log(new Date(id64ts(id64())))
console.log(new Date(id64ts(id64())))

function* untilDuplicated(fn: () => unknown) {
  let last = ""
  let i = 0
  while (true) {
    i++
    const current = String(fn())
    yield [i, current] as const
    if (current <= last) break
    last = current
  }
}

let i: number = 0, id: string = ""
for ([i, id] of untilDuplicated(id64)) {
  if ((i % 1_000_000) === 0) break
}
console.info(i, id)
