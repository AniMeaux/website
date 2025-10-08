/**
 * Returns `value` with all whitespace removed and all `,` replaced by `.`.
 *
 * We don't use `<input type="number">` because it has some issues. Instead,
 * we use `<input type="text" inputmode="decimal">` which allows users to enter
 * numbers in a more flexible way. But the internationalization is no longer
 * done automatically. This function ensures that French numbers are normalized
 * before parsing them.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#problems
 */
export function normalizeNumber(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  return (
    value
      // Remove thousands separators and other whitespace.
      .replaceAll(/\s+/g, "")
      // Replace French decimal separators.
      .replaceAll(",", ".")
  );
}
