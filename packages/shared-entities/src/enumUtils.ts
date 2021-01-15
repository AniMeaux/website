export function sortByLabels<Enum extends string>(
  enumKeys: Enum[],
  labels: Record<Enum, string>
): Enum[] {
  const enumKeysCopy = enumKeys.slice();

  enumKeysCopy.sort((a, b) => {
    const labelA = labels[a];
    const labelB = labels[b];

    if (labelA < labelB) {
      return -1;
    }

    if (labelA > labelB) {
      return 1;
    }

    return 0;
  });

  return enumKeysCopy;
}
