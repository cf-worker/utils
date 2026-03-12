// deno-coverage-ignore-file
import { URLPatternPolyfill } from "./URLPatternPolyfill.ts"

if (typeof globalThis.URLPattern === "undefined") {
  globalThis.URLPattern = URLPatternPolyfill as unknown as typeof URLPattern
}
