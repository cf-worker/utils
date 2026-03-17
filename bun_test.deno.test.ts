if ("Deno" in globalThis) {
  Deno.test("expect exposes remaining matcher branches", async () => {
    const { expect } = await import("./bun_test.deno.ts")

    expect(2).toBeGreaterThanOrEqual(1)
    expect(2).toBeLessThanOrEqual(2)
    expect(1).toBeLessThan(2)
    expect(new Response("ok")).toBeInstanceOf(Response)
    expect("hello world").toMatch("world")
    expect("hello world").toMatch(/hello/)
  })

  Deno.test("spyOn can replace an implementation and restore it", async () => {
    const { expect, spyOn } = await import("./bun_test.deno.ts")
    const target = {
      greet(name: string) {
        return `hello ${name}`
      },
    }

    const greetSpy = spyOn(target, "greet")
    greetSpy.mockImplementation((name) => `hi ${name}`)

    expect(target.greet("alice")).toBe("hi alice")

    greetSpy.mockRestore()
    expect(target.greet("alice")).toBe("hello alice")
  })
}
