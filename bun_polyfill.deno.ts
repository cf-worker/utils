import { exists } from "@std/fs/exists"

export function file(filePath: string) {
  return {
    exists: () => exists(filePath),
  }
}
