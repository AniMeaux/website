export function toObject(data: FormData | URLSearchParams) {
  const map = new Map<string, unknown[]>();

  for (const [key, value] of data) {
    const currentValue = map.get(key);

    if (currentValue == null) {
      map.set(key, [value]);
    } else {
      currentValue.push(value);
    }
  }

  return Object.fromEntries(
    Array.from(map.entries()).map(([key, value]) => [
      key,
      value.length === 1 ? value[0] : value,
    ]),
  );
}
