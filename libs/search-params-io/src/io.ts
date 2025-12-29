import { SearchParamsReader } from "./reader.js";
import { SearchParamsWritter } from "./writter.js";

export interface SearchParamsIO<TKeys extends Record<string, string>, TData>
  extends SearchParamsReader<TKeys, TData>,
    SearchParamsWritter<TKeys, Partial<TData>> {
  set(
    searchParams: URLSearchParams,
    data: Partial<TData> | ((data: TData) => Partial<TData>),
  ): URLSearchParams;

  copy(from: URLSearchParams, to: URLSearchParams): URLSearchParams;
}

export namespace SearchParamsIO {
  export const getValue = SearchParamsReader.getValue;
  export const getValues = SearchParamsReader.getValues;
  export const setValue = SearchParamsWritter.setValue;
  export const setValues = SearchParamsWritter.setValues;

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

    const set: SearchParamsIO<TKeys, TData>["set"] = (searchParams, data) => {
      if (typeof data === "function") {
        data = data(reader.parse(searchParams));
      }

      return writter.set(searchParams, data);
    };

    const copy: SearchParamsIO<TKeys, TData>["copy"] = (from, to) => {
      return set(to, reader.parse(from));
    };

    return { ...reader, ...writter, set, copy };
  }

  export type Infer<TSearchParamsIO extends SearchParamsIO<any, any>> =
    SearchParamsReader.Infer<TSearchParamsIO>;
}
