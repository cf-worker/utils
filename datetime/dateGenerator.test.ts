import { expect, test } from "bun:test"
import { dateGenerator } from "./dateGenerator.ts"

test("dateGenerator default values", () => {
  const dates = []
  for (const date of dateGenerator(new Date(0))) {
    dates.push(date)
    if (dates.length >= 2) break
  }
  expect(dates).toEqual([new Date(0), new Date(dateGenerator.DAY)])
})

test("dateGenerator zero interval", () => {
  const dates = Array.from(dateGenerator(new Date(0), 0))
  expect(dates).toEqual([new Date(0)])
})

test("dateGenerator same start/end date", () => {
  const dates = Array.from(dateGenerator(new Date(0), dateGenerator.SECOND, new Date(0)))
  expect(dates).toEqual([new Date(0)])
})

test("dateGenerator SECOND", () => {
  const dates = Array.from(
    dateGenerator(new Date(0), dateGenerator.SECOND, new Date(dateGenerator.SECOND)),
  )
  expect(dates).toEqual([new Date(0), new Date(dateGenerator.SECOND)])
})

test("dateGenerator down WEEK", () => {
  const dates = Array.from(
    dateGenerator(
      dateGenerator.parse("2025-01-31"),
      -dateGenerator.WEEK,
      dateGenerator.parse("2025-01-01"),
    ),
  )
  expect(dates).toEqual([
    dateGenerator.parse("2025-01-31"),
    dateGenerator.parse("2025-01-24"),
    dateGenerator.parse("2025-01-17"),
    dateGenerator.parse("2025-01-10"),
    dateGenerator.parse("2025-01-03"),
  ])
})

test("dateGenerator up WEEK", () => {
  const dates = Array.from(
    dateGenerator(
      dateGenerator.parse("2025-01-03"),
      dateGenerator.WEEK,
      dateGenerator.parse("2025-02-01"),
    ),
  )
  expect(dates).toEqual([
    dateGenerator.parse("2025-01-03"),
    dateGenerator.parse("2025-01-10"),
    dateGenerator.parse("2025-01-17"),
    dateGenerator.parse("2025-01-24"),
    dateGenerator.parse("2025-01-31"),
  ])
})
