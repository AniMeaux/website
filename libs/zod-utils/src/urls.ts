import type { ZodString } from "zod"
import { z } from "zod"

/**
 * Allow missing protocol in URL and adds it if needed.
 *
 * @example
 * simpleUrl().pipe(zu.string().max(128))
 */
export function simpleUrl(...params: Parameters<ZodString["url"]>) {
  return z.union([
    z.string().url(...params),
    z.preprocess(
      (value) => (typeof value === "string" ? `https://${value}` : value),
      z.string().url(...params),
    ),
  ])
}
