/**
 * arrays/arrayDifference module.
 * @module
 */
export type ArrayDiff = {
  removed: number[]
  added: number[]
}
/**
 * The implementation of arrayDifference is much simpler but much slower than this
 * Use for arrays with over 1000 elements
 * Returns the elements that were removed from oldArray and added by newArray
 * @param oldArray
 * @param newArray
 * @param sorted Set to true if the arrays are already sorted
 * @returns ArrayDiff The removed and added elements
 */
export function arrayDifference(oldArray: number[], newArray: number[], sorted = false): ArrayDiff {
  const removed: number[] = []
  const added: number[] = []

  const A = sorted ? oldArray : oldArray.toSorted()
  const B = sorted ? newArray : newArray.toSorted()

  let ai = 0
  let bi = 0

  while (ai < A.length && bi < B.length) {
    const a = A[ai]
    const b = B[bi]
    if (a === b) {
      ai++
      bi++
    } else if (a < b) {
      removed.push(a)
      ai++
    } else {
      added.push(b)
      bi++
    }
  }

  if (ai < A.length) removed.push(...A.slice(ai))
  if (bi < B.length) added.push(...B.slice(bi))

  return { removed, added }
}
