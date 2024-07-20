import { assertEquals } from "@std/assert"
import { recursiveBinarySearchMax } from "./recursiveBinarySearchMax.ts"

Deno.test("recursiveBinarySearchMax from 0 to 100", () => {
  const min = 0
  const max = 100
  for (let i = min; i <= max; i++) {
    assertEquals(recursiveBinarySearchMax(min, max, (v) => v <= i), i)
  }
})

Deno.test("recursiveBinarySearchMax should return lower than min if not found", () => {
  const min = 5
  const max = 10
  assertEquals(recursiveBinarySearchMax(min, max, (v) => v > max), 4)
})
