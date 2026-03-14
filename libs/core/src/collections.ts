export function ensureArray<DataType>(
  value: undefined | null | DataType[] | DataType,
) {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
