export function visit<
  TType extends string,
  TData extends { type: TType },
  TResult
>(
  data: TData,
  visitors: {
    [key in TType]: (data: ExtractByType<TData, key>) => TResult;
  }
) {
  return visitors[data.type](data as ExtractByType<TData, TType>) as TResult;
}

type ExtractByType<
  TData extends { type: any },
  TType extends TData["type"]
> = TData extends any ? (TData["type"] extends TType ? TData : never) : never;
