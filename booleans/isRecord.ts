/**
 * Checks if a value is a record (an object with string keys and unknown values).
 * @description Accepts only { [key: string]: unknown } objects, not arrays, classes, dates, etc.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a record.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]"
  // below also works
  // return !!value && Object.prototype.constructor(value).constructor === Object

  // below fails to Class, Date, String
  // return value !== null && typeof value === "object" && !Array.isArray(value)
}
