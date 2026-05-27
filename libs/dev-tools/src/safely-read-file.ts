import { readFile } from "node:fs/promises"

export async function safelyReadFile(path: string) {
  let content: undefined | string
  try {
    content = await readFile(path, "utf-8")
  } catch (_error) {}

  return content
}
