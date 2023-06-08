export function ensureArray<DataType>(
  value: undefined | null | DataType[] | DataType
) {
  if (value == null) {
    return [];
  }

  const array = Array.isArray(value) ? value : [value];
  return array.filter(Boolean);
}
