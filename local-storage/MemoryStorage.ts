/**
 * local-storage/MemoryStorage module.
 * @module
 */
export class MemoryStorage implements Storage {
  // deno-lint-ignore no-explicit-any
  [name: string]: any

  #storage: { [key: string]: string } = {}
  #limit = 5_242_880 // browser localStorage limit
  #usage = 0
  #encoder = new TextEncoder()

  #bytes(str: string): number {
    return this.#encoder.encode(str).length
  }

  #hasKey(key: string): boolean {
    return key in this.#storage
  }

  #keyUsage(key: string): number {
    return this.#hasKey(key) ? this.#bytes(key) + this.#bytes(this.#storage[key]) : 0
  }

  constructor(opts?: { limit?: number }) {
    this.#limit = opts?.limit ?? this.#limit

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          // @ts-ignore allow symbol as index
          const targetProp = target[prop]
          if (typeof targetProp === "function") {
            return targetProp.bind(target)
          }
          return targetProp
        }
        return target.getItem(prop as string) ?? undefined
      },

      set(target, prop, value) {
        target.setItem(prop as string, value)
        return true
      },

      deleteProperty(target, prop) {
        target.removeItem(prop as string)
        return true
      },

      ownKeys(target) {
        const keys = []
        for (let i = 0; i < target.length; i++) {
          keys.push(String(target.key(i)))
        }
        return Reflect.ownKeys(target).concat(keys)
      },

      // supports in operator
      has(target, prop) {
        return target.#hasKey(prop as string)
      },

      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true,
        }
      },
    })
  }

  get length(): number {
    return Object.keys(this.#storage).length
  }

  clear(): void {
    for (const key in this.#storage) {
      delete this.#storage[key]
    }
  }

  getItem(key: string): string | null {
    return this.#storage[key] ?? null
  }

  key(index: number): string | null {
    const keys = Object.keys(this.#storage)
    return index >= 0 && index < keys.length ? keys[index] : null
  }

  removeItem(key: string): void {
    this.#usage -= this.#keyUsage(key)
    delete this.#storage[key]
  }

  setItem(key: string, value: string): void {
    const newSize = this.#bytes(key) + this.#bytes(value)
    const oldSize = this.#keyUsage(key)
    const size = this.#usage - oldSize + newSize
    if (size > this.#limit) {
      const exceeded = size - this.#limit
      const msg = `Quota ${this.#limit} bytes exceeded by ${exceeded} bytes`
      throw new DOMException(msg, "QuotaExceededError")
    }
    this.#storage[key] = String(value)
    this.#usage = size
  }

  get [Symbol.toStringTag](): string {
    return this.toString()
  }

  toString(): string {
    return JSON.stringify(this.#storage)
  }

  toJSON(): object {
    return this.#storage
  }
}
