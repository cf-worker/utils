import type { Func } from "../types.ts"

// @TODO: fix types
export function pipe(...fns: Func[]): Func {
  return fns.reduce(pipe2)
}

export function pipe2<A extends Func, B extends (arg: ReturnType<A>) => ReturnType<B>>(
  a: A,
  b: B,
): (arg: Parameters<A>[0]) => ReturnType<B> {
  return (arg: Parameters<A>[0]): ReturnType<B> => b(a(arg))
}

export function pipe3<
  A extends Func,
  B extends (arg: ReturnType<A>) => ReturnType<B>,
  C extends (arg: ReturnType<B>) => ReturnType<C>,
>(a: A, b: B, c: C): ReturnType<typeof pipe2> {
  return pipe2(pipe2(a, b), c)
}
