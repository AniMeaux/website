export interface SearchParamsWritter<
  TKeys extends Record<string, string>,
  TInput,
> {
  keys: TKeys;

  set(searchParams: URLSearchParams, data: TInput): URLSearchParams;

  /**
   * Alias for `writter.set(new URLSearchParams(), data)`.
   */
  create(data: TInput): URLSearchParams;

  /**
   * Alias for `writter.create(data).toString()`.
   */
  format(data: TInput): string;

  clear(searchParams: URLSearchParams): URLSearchParams;
}

export namespace SearchParamsWritter {
  export function create<TKeys extends Record<string, string>, TInput>({
    keys,
    setFunction,
  }: {
    keys: TKeys;
    setFunction: SearchParamsWritter.SetFunction<TKeys, TInput>;
  }): SearchParamsWritter<TKeys, TInput> {
    const set: SearchParamsWritter<TKeys, TInput>["set"] = (
      searchParams,
      data,
    ) => {
      setFunction(data, {
        searchParams,
        keys,

        setValue(key, value) {
          if (value == null) {
            searchParams.delete(key);
            return;
          }

          searchParams.set(key, value);
        },

        setValues(key, values) {
          searchParams.delete(key);

          values?.forEach((value) => {
            searchParams.append(key, value);
          });
        },
      });

      return searchParams;
    };

    const create: SearchParamsWritter<TKeys, TInput>["create"] = (data) => {
      return set(new URLSearchParams(), data);
    };

    const format: SearchParamsWritter<TKeys, TInput>["format"] = (data) => {
      return create(data).toString();
    };

    const clear: SearchParamsWritter<TKeys, TInput>["clear"] = (
      searchParams,
    ) => {
      Object.values(keys).forEach((key) => {
        searchParams.delete(key);
      });

      return searchParams;
    };

    return { keys, set, create, format, clear };
  }

  export type Infer<TWritter extends SearchParamsWritter<any, any>> =
    TWritter extends SearchParamsWritter<any, infer TInput> ? TInput : never;

  export type SetFunction<TKeys extends Record<string, string>, TInput> = (
    data: TInput,
    context: {
      searchParams: URLSearchParams;
      keys: TKeys;

      /**
       * Sets or deletes the value for the given search parameter.
       */
      setValue: (key: string, value?: null | string) => void;

      /**
       * Sets of deletes the values for the given search parameter.
       */
      setValues: (key: string, values?: null | string[] | Set<string>) => void;
    },
  ) => void;
}
