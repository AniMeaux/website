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
export function oneAtTheTime(fn: () => Promise<void>) {
  let currentCall: null | Promise<void> = null;

  return async () => {
    if (currentCall != null) {
      return await currentCall;
    }

    try {
      currentCall = fn();
      await currentCall;
    } finally {
      currentCall = null;
    }
  };
}
