import { orderBy } from "es-toolkit/array"

import { getLengthValuePx } from "#i/get-length-value-px.js"

export function formatBreakpoints(breakpoints: Map<string | null, string>) {
  const sortedEntries = orderBy(
    Array.from(breakpoints.entries())
      // `null` is used as key for a property with the namespace's name (e.g.
      // `--breakpoint: <value>`).
      // For breakpoints this shouldn't happen.
      .filter((entry): entry is [string, string] => entry[0] != null)
      .map(
        ([breakpoint, length]) =>
          [breakpoint, getLengthValuePx(length)] as const,
      ),
    [([_breakpoint, valuePx]) => valuePx],
    ["desc"],
  )

  return `export type Breakpoint = typeof Breakpoint.names[number]

export namespace Breakpoint {
  /** Breakpoint names sorted by descending value. */
  export const names = ${JSON.stringify(
    sortedEntries.map(([breakpoint]) => breakpoint),
  )} as const

  /** Breakpoint values in pixels. */
  export const value = ${JSON.stringify(Object.fromEntries(sortedEntries), null, 2)} as const
}`
}
