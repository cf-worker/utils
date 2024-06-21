// this code is invalid
// true ? "truthy" : (throw new Error())
// this is valid
// true ? "truthy" : raise(new Error())
export function raise(error: unknown): void {
  throw error
}
