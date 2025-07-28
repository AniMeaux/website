export namespace Enums {
  /**
   * Returns a new enum with `valuesToOmit` removed from `enumObj`.
   */
  export function omit<
    TEnum extends Record<string, string | number>,
    TValues extends readonly TEnum[keyof TEnum][],
  >(enumObj: TEnum, valuesToOmit: TValues) {
    const newEnumObj = Object.fromEntries(
      Object.entries(enumObj).filter(
        ([_, value]) => !valuesToOmit.includes(value as TEnum[keyof TEnum]),
      ),
    );

    return newEnumObj as {
      [TKey in keyof TEnum as TEnum[TKey] extends TValues[number]
        ? never
        : TKey]: TEnum[TKey];
    };
  }

  /**
   * Returns a new enum with only `valuesToPick` from `enumObj`.
   */
  export function pick<
    TEnum extends Record<string, string | number>,
    TValues extends readonly TEnum[keyof TEnum][],
  >(enumObj: TEnum, valuesToPick: TValues) {
    const newEnumObj = Object.fromEntries(
      Object.entries(enumObj).filter(([_, value]) =>
        valuesToPick.includes(value as TEnum[keyof TEnum]),
      ),
    );

    return newEnumObj as {
      [TKey in keyof TEnum as TEnum[TKey] extends TValues[number]
        ? TKey
        : never]: TEnum[TKey];
    };
  }
}
