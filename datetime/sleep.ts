export function sleep(ms: number): Promise<number> {
  const start = Date.now()
  return new Promise<number>((resolve) => setTimeout(() => resolve(Date.now() - start), ms))
}
