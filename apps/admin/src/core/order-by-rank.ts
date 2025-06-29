export function orderByRank<TValue extends { id: string }>(
  values: TValue[],
  hits: { id: string }[],
  { take }: { take?: number } = {},
) {
  const valuesById = new Map(values.map((value) => [value.id, value]));

  const orderedValues: typeof values = [];

  for (const hit of hits) {
    if (take === orderedValues.length) {
      break;
    }

    const value = valuesById.get(hit.id);

    if (value != null) {
      orderedValues.push(value);
    }
  }

  return orderedValues;
}
