// this code is invalid
// true ? "truthy" : (throw new Error())
// this is valid
// true ? "truthy" : raise(new Error())
/**
 * Throw the provided error value.
 */
export function raise(error: unknown): never {
  throw error
}
