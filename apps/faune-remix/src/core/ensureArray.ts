export function ensureArray<DataType>(value: DataType[] | DataType | null) {
  if (value == null) {
    return [];
  }

  const array = Array.isArray(value) ? value : [value];
  return array.filter(Boolean);
}
