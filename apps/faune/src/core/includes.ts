/**
 * Checks if some values are in an array.
 *
 * @param array The array to inspect
 * @param values The values to search for
 * @returns Returns `true` if one of the values is found, otherwise `false`.
 */
export function includes<T>(array: T[], ...values: T[]): boolean {
  return array.some((value) => values.includes(value));
}
