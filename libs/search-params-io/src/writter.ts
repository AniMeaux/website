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
   * Alias for `writter.set(new URLSearchParams(), data).toString()`.
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
      setFunction(searchParams, data, keys);
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

  /**
   * Sets or deletes the value for the given search parameter.
   */
  export function setValue(
    searchParams: URLSearchParams,
    key: string,
    value?: null | string,
  ) {
    if (value == null) {
      searchParams.delete(key);
      return;
    }

    searchParams.set(key, value);
  }

  /**
   * Sets of deletes the values for the given search parameter.
   */
  export function setValues(
    searchParams: URLSearchParams,
    key: string,
    values?: null | string[] | Set<string>,
  ) {
    searchParams.delete(key);

    values?.forEach((value) => {
      searchParams.append(key, value);
    });
  }

  export type Infer<TWritter extends SearchParamsWritter<any, any>> =
    TWritter extends SearchParamsWritter<any, infer TInput> ? TInput : never;

  export type SetFunction<TKeys extends Record<string, string>, TInput> = (
    searchParams: URLSearchParams,
    data: TInput,
    keys: TKeys,
  ) => void;
}
