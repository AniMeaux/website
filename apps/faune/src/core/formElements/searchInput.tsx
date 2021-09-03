import { SearchFilter } from "@animeaux/shared-entities";
import { ensureArray } from "core/ensureArray";
import { ActionAdornment, Adornment } from "core/formElements/adornment";
import { Input, InputProps } from "core/formElements/input";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

function useDebouncedValue<ValueType>(value: ValueType) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
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
  const [rawSearch, setRawSearch] = useState(
    () => generateInitialState(initialSearch) ?? ""
  );

  const search = useDebouncedValue(rawSearch);
  return { search, rawSearch, setRawSearch };
}

export function useSearchAndFilters<FilterType>(
  initialSearchFilters: InitialStateFactory<SearchFilter & FilterType>
) {
  const initialSearchFiltersRef = useRef(initialSearchFilters);
  const initialValues = useMemo(
    () => generateInitialState(initialSearchFiltersRef.current),
    []
  );

  const { search: initialSearch, ...initialFilters } = initialValues;

  const search = useSearch(initialSearch);

  const [filters, setFilters] = useState(
    // `FilterType` cannot contain a `search` property.
    initialFilters as FilterType
  );

  return { ...search, filters, setFilters };
}

export type SearchInputProps = Omit<
  InputProps,
  "leftAdornment" | "type" | "role"
>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
        className="SearchInput"
      />
    );
  }
);
