/**
 * datetime/dateGenerator module.
 * @module
 */
/**
 * Generates sequential dates
 * @param startDate
 * @param interval
 */
export function* dateGenerator(
  startDate: Date,
  interval = dateGenerator.DAY,
  endDate?: Date,
): Generator<Date> {
  let date = new Date(startDate)
  if (interval === 0) {
    yield date
    return
  }
  while (true) {
    if (endDate) {
      if (date.getTime() === endDate.getTime()) {
        yield date
        break
      }
      if (interval > 0) {
        if (date.getTime() > endDate.getTime()) break
      } else {
        if (date.getTime() < endDate.getTime()) break
      }
    }
    yield date
    date = new Date(date.getTime() + interval)
  }
}

/** Parse a date string using `Date.parse()`. */
dateGenerator.parse = (str: string): Date => new Date(Date.parse(str))
/** Milliseconds in one second. */
dateGenerator.SECOND = 1000
/** Milliseconds in one minute. */
dateGenerator.MINUTE = 60 * dateGenerator.SECOND
/** Milliseconds in one hour. */
dateGenerator.HOUR = 60 * dateGenerator.MINUTE
/** Milliseconds in one day. */
dateGenerator.DAY = 24 * dateGenerator.HOUR
/** Milliseconds in one week. */
dateGenerator.WEEK = 7 * dateGenerator.DAY
