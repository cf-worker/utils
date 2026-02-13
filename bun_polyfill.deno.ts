import { exists } from "@std/fs/exists"

/**
 * Minimal Bun-compatible `file()` helper used by tests.
 */
export function file(filePath: string): { exists: () => Promise<boolean> } {
  return {
    exists: () => exists(filePath),
  }
}
