import { expect, test } from "bun:test"
import { prettyElapsed } from "./prettyElapsed.ts"

test("prettyElapsed", () => {
  // Test with 0 milliseconds
  expect(prettyElapsed(0)).toBe("0ms")
  expect(prettyElapsed(123.4)).toBe("123ms")
  expect(prettyElapsed(123.5)).toBe("124ms")

  // Test with milliseconds only (less than 1 second)
  expect(prettyElapsed(100)).toBe("100ms")
  expect(prettyElapsed(999)).toBe("999ms")

  // Test with seconds only (less than 1 minute)
  expect(prettyElapsed(1000)).toBe("01s")
  expect(prettyElapsed(59999)).toBe("59s")

  // Test with minutes only (less than 1 hour)
  expect(prettyElapsed(60000)).toBe("01m00s")
  expect(prettyElapsed(359999)).toBe("05m59s")
  expect(prettyElapsed(360000)).toBe("06m00s")

  expect(prettyElapsed(86399999)).toBe("23h59m59s")

  // Test with days only
  expect(prettyElapsed(86400000)).toBe("1d00h00m00s")
  expect(prettyElapsed(172800000)).toBe("2d00h00m00s")

  // Test with multiple units (e.g., days, hours, minutes, seconds)
  expect(prettyElapsed(90061000)).toBe("1d01h01m01s")
  expect(prettyElapsed(93720000)).toBe("1d02h02m00s")
})
