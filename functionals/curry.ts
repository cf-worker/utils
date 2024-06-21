export function curry<T extends Func>(fn: T, arg1: Parameters<T>[0]): (...rest: Rest<T>) => ReturnType<T> {
  return (...rest: Rest<T>): ReturnType<T> => fn(arg1, ...rest)
}
