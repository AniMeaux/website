import { readFile } from "node:fs/promises";
import { relative } from "path/posix";

export async function safelyReadFile(path: string) {
  let content: undefined | string;
  try {
    content = await readFile(path, "utf-8");
  } catch (error) {}

  return content;
}

export function relativeToCwd(filePath: string): string {
  return relative(process.cwd(), filePath);
}
