/**
 * bun does not have URLPattern,
 * this class is a reduced polyfill for URLPattern just no make matchPath work
 * import { URLPatternPolyfill } from "@cf-worker/utils"
 * globalThis.URLPattern = URLPatternPolyfill
 */
export class URLPatternPolyfill {
  #regexp: RegExp

  constructor({ pathname }: { pathname: string }) {
    // https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts#L22
    const pattern = pathname
      .replace(/\/+(\/|$)/g, "$1") // strip double & trailing splash
      .replace("(.+)", "+") // convert URLPattern greed wildcard to regex
      .replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))") // greedy params
      .replace(/(\/?\.?):(\w+)/g, "$1(?<$2>[^$1/]+?)") // named params and image format
      .replace(/\./g, "\\.") // dot in path
      .replace(/(\/?)\*/g, "($1.*)?") // wildcard

    this.#regexp = RegExp(`^${pattern}/*$`)
  }

  exec({ pathname }: { pathname: string }) {
    const groups = this.#regexp.exec(pathname)?.groups
    if (!groups) return null
    return {
      pathname: {
        groups,
      },
    }
  }
}
