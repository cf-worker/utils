import { expect, test } from "bun:test"
import { arrayDifference } from "./arrayDifference.ts"

test("arrayDifference should return the difference between two arrays", () => {
  const array1 = [1, 2, 3, 4, 5]
  const array2 = [3, 4, 5, 6, 7, 8]
  const expected = {
    removed: [1, 2],
    added: [6, 7, 8],
  }

  const expected2 = {
    removed: [6, 7, 8],
    added: [1, 2],
  }

  const result = arrayDifference(array1, array2, true)

  expect(result).toEqual(expected)

  const result2 = arrayDifference(array2, array1, true)

  expect(result2).toEqual(expected2)
})

test("arrayDifference unsorted", () => {
  const array1 = [5, 4, 3, 2, 1]
  const array2 = [6, 7, 8, 3, 4, 5]
  const expected = {
    removed: [1, 2],
    added: [6, 7, 8],
  }

  const expected2 = {
    removed: [6, 7, 8],
    added: [1, 2],
  }

  const result = arrayDifference(array1, array2)

  expect(result).toEqual(expected)

  const result2 = arrayDifference(array2, array1)

  expect(result2).toEqual(expected2)
})
