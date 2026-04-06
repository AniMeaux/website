import { orderBy } from "es-toolkit/array"

export function orderEnumBy<TEnum extends string>(
  enumValues: TEnum[],
  criteria: (value: TEnum) => unknown,
  direction: "asc" | "desc" = "asc",
) {
  return orderBy(
    enumValues.map((value) => ({ value })),
    [({ value }) => criteria(value)],
    [direction],
  ).map(({ value }) => value)
}
