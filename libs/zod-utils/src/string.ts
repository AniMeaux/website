/**
 * Returns `value` with all `\r\n` (CRLF) replaced by `\n` (LF) when it's a
 * string. Returns `value` as is when it's not a string.
 *
 * In textarea, browsers use `\n` (LF) client-side but serialize values with
 * `\r\n` (CRLF) in form submissions. This cause length mismatches between
 * client-side and server-side validation. This function ensures consistent
 * newline representation across environments.
 */
export function normalizeLineBreaks(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replaceAll(/\r\n/g, "\n");
}
