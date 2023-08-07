export function ensureArray<DataType>(
  value: undefined | null | DataType[] | DataType
) {
  if (value == null) {
    return [];
  }

  const array = Array.isArray(value) ? value : [value];
  return array.filter(Boolean);
}

export function isIterable(value: unknown): value is Iterable<any> {
  return Symbol.iterator in (value as Iterable<any>);
}
