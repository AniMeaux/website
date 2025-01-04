export function ensureArray<DataType>(
  value: undefined | null | DataType[] | DataType,
) {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function isIterable(value: unknown): value is Iterable<any> {
  return (
    value != null &&
    typeof value === "object" &&
    Symbol.iterator in (value as Iterable<any>)
  );
}
