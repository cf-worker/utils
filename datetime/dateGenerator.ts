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

dateGenerator.parse = (str: string): Date => new Date(Date.parse(str))
dateGenerator.SECOND = 1000
dateGenerator.MINUTE = 60 * dateGenerator.SECOND
dateGenerator.HOUR = 60 * dateGenerator.MINUTE
dateGenerator.DAY = 24 * dateGenerator.HOUR
dateGenerator.WEEK = 7 * dateGenerator.DAY
