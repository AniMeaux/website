import isEqual from "lodash.isequal";

export interface SearchParamsReader<
  TKeys extends Record<string, string>,
  TOutput,
> {
  keys: TKeys;

  parse(searchParams: URLSearchParams): TOutput;

  areEqual(a: URLSearchParams, b: URLSearchParams): boolean;

  /**
   * Alias for `reader.areEqual(searchParams, new URLSearchParams())`.
   */
  isEmpty(searchParams: URLSearchParams): boolean;
}

export namespace SearchParamsReader {
  export function create<TKeys extends Record<string, string>, TOutput>({
    keys,
    parseFunction,
  }: {
    keys: TKeys;
    parseFunction: SearchParamsReader.ParseFunction<TKeys, TOutput>;
  }): SearchParamsReader<TKeys, TOutput> {
    const parse: SearchParamsReader<TKeys, TOutput>["parse"] = (
      searchParams,
    ) => {
      return parseFunction({
        searchParams,
        keys,

        getValue(key) {
          return searchParams.get(key) ?? undefined;
        },

        getValues(key) {
          return searchParams.getAll(key);
        },
      });
    };

    const areEqual: SearchParamsReader<TKeys, TOutput>["areEqual"] = (a, b) => {
      return isEqual(parse(a), parse(b));
    };

    const isEmpty: SearchParamsReader<TKeys, TOutput>["isEmpty"] = (
      searchParams,
    ) => {
      return areEqual(searchParams, new URLSearchParams());
    };

    return { keys, parse, areEqual, isEmpty };
  }

  export type Infer<TReader extends SearchParamsReader<any, any>> =
    TReader extends SearchParamsReader<any, infer TOutput> ? TOutput : never;

  export type ParseFunction<
    TKeys extends Record<string, string>,
    TOutput,
  > = (context: {
    searchParams: URLSearchParams;
    keys: TKeys;

    /**
     * Same as `URLSearchParams.get()` but returns `undefined` instead of
     * `null` for missing search parameters.
     */
    getValue: (key: string) => undefined | string;

    /**
     * Same as `URLSearchParams.getAll()`.
     * Here for consistency with `getValue`.
     */
    getValues: (key: string) => string[];
  }) => TOutput;
}
