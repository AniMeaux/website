import invariant from "tiny-invariant"

import { getLengthValuePx } from "#i/get-length-value-px.js"

export function formatSpacing(spacings: Map<string | null, string>) {
  // A property with the namespace's name has `null` as key. (e.g.
  // `--spacing: <value>`).
  const spacing = spacings.get(null)

  invariant(spacing != null, "A `--spacing` definition is missing in the theme")

  return `export namespace Spacing {
  export const unitPx = ${getLengthValuePx(spacing)}
}`
}
