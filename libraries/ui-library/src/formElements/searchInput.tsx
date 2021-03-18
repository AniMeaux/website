import { SearchFilter } from "@animeaux/shared-entities";
import * as React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ensureArray } from "../core";
import { ActionAdornment, Adornment } from "./adornment";
import { Input, InputProps } from "./input";

function useDebouncedValue<ValueType>(value: ValueType) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), 250);
    return () => clearTimeout(timeout);
  }, [value]);

  return debouncedValue;
}

type InitialStateFactory<DataType> = DataType | (() => DataType);

function generateInitialState<DataType>(
  factory: InitialStateFactory<DataType>
) {
  if (typeof factory !== "function") {
    return factory;
  }

  // Cast `factory` because `DataType` could be a function in which case TS
  // cannot tell whether `factory` is a unknow function (`DataType`) or a
  // factory (`() => DataType`).
  return (factory as () => DataType)();
}

export function useSearch(
  initialSearch: InitialStateFactory<string | null | undefined>
) {
  const [rawSearch, setRawSearch] = React.useState(
    () => generateInitialState(initialSearch) ?? ""
  );

  const search = useDebouncedValue(rawSearch);
  return { search, rawSearch, setRawSearch };
}

export function useSearchAndFilters<FilterType>(
  initialSearchFilters: InitialStateFactory<SearchFilter & FilterType>
) {
  const initialSearchFiltersRef = React.useRef(initialSearchFilters);
  const initialValues = React.useMemo(
    () => generateInitialState(initialSearchFiltersRef.current),
    []
  );

  const { search: initialSearch, ...initialFilters } = initialValues;

  const search = useSearch(initialSearch);

  const [filters, setFilters] = React.useState(
    // `FilterType` cannot contain a `search` property.
    initialFilters as FilterType
  );

  return { ...search, filters, setFilters };
}

export type SearchInputProps = Omit<
  InputProps,
  "leftAdornment" | "type" | "role"
>;

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ rightAdornment, ...props }, ref) {
    return (
      <Input
        {...props}
        type="text"
        role="search"
        ref={ref}
        leftAdornment={
          <Adornment>
            <FaSearch />
          </Adornment>
        }
        rightAdornment={[
          props.value !== "" && (
            <ActionAdornment onClick={() => props.onChange?.("")}>
              <FaTimes />
            </ActionAdornment>
          ),
          ...ensureArray(rightAdornment),
        ]}
      />
    );
  }
);
