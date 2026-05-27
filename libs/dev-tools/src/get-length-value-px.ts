/**
 * Matches values for the `<length>` CSS type.
 * We only support unitless `0`, rem and px.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length
 */
const CSS_LENGTH_REGEXP = /(?<value>-?\d*\.?\d+)(?<unit>.*)/

/**
 * Returns the given CSS length in pixels.
 *
 * @param length expressed with the `<length>` CSS type.
 * @returns The value in pixels
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length
 */
export function getLengthValuePx(length: string) {
  length = length.trim()

  const match = length.match(CSS_LENGTH_REGEXP)

  if (match?.groups?.value == null) {
    throw new Error(`Invalid CSS length from theme: "${length}"`)
  }

  const value = Number(match.groups.value)

  // The unit is optional when the value is `0`.
  // See https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#syntax
  const unit = match.groups.unit || "px"

  switch (unit) {
    case "px": {
      return value
    }

    case "rem": {
      return 16 * value
    }

    default: {
      throw new Error(`Unsupported length unit: "${unit}" in "${length}"`)
    }
  }
}
