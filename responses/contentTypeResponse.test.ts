import { expect, test } from "bun:test"
import { contentTypeResponse } from "./contentTypeResponse.ts"

test("contentTypeResponse", () => {
  const body = "a;b;c"
  const init = {
    status: 201,
    headers: [
      ["Content-Disposition", "attachment; filename=report.csv"],
    ],
  }

  const response = contentTypeResponse(body, "text/csv", init)

  expect(response.status).toBe(201)
  expect(response.headers.get("Content-Type")).toBe("text/csv;charset=UTF-8")
  expect(response.headers.get("Content-Disposition")).toBe("attachment; filename=report.csv")
})
