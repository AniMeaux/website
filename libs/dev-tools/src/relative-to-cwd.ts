import { relative } from "path/posix"

export function relativeToCwd(filePath: string) {
  return relative(process.cwd(), filePath)
}
