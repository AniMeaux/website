import { SearchParamsReader } from "./reader";
import { SearchParamsWritter } from "./writter";

export interface SearchParamsIO<TKeys extends Record<string, string>, TData>
  extends SearchParamsReader<TKeys, TData>,
    SearchParamsWritter<TKeys, Partial<TData>> {
  set(
    searchParams: URLSearchParams,
    dataAction: Partial<TData> | ((currentData: TData) => Partial<TData>),
  ): URLSearchParams;

  copy(from: URLSearchParams, to: URLSearchParams): URLSearchParams;
}

export namespace SearchParamsIO {
  export function create<TKeys extends Record<string, string>, TData>({
    keys,
    parseFunction,
    setFunction,
  }: {
    keys: TKeys;
    parseFunction: SearchParamsReader.ParseFunction<TKeys, TData>;
    setFunction: SearchParamsWritter.SetFunction<TKeys, Partial<TData>>;
  }): SearchParamsIO<TKeys, TData> {
    const reader = SearchParamsReader.create({ keys, parseFunction });
    const writter = SearchParamsWritter.create({ keys, setFunction });

    const set: SearchParamsIO<TKeys, TData>["set"] = (
      searchParams,
      dataAction,
    ) => {
      return writter.set(
        searchParams,
        typeof dataAction === "function"
          ? dataAction(reader.parse(searchParams))
          : dataAction,
      );
    };

    const copy: SearchParamsIO<TKeys, TData>["copy"] = (from, to) => {
      return set(to, reader.parse(from));
    };

    return { ...reader, ...writter, set, copy };
  }

  export type Infer<TSearchParamsIO extends SearchParamsIO<any, any>> =
    SearchParamsReader.Infer<TSearchParamsIO>;
}
