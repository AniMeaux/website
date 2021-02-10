import * as React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ensureArray } from "../core";
import { ActionAdornment, Adornment } from "./adornment";
import { Input, InputProps } from "./input";

function useDebouncedValue<ValueType>(value?: ValueType) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), 250);
    return () => clearTimeout(timeout);
  }, [value]);

  return debouncedValue;
}

export function useSearch(initialSearch: string) {
  const [rawSearch, setRawSearch] = React.useState(initialSearch);
  const search = useDebouncedValue(rawSearch);
  return { search, rawSearch, setRawSearch };
}

export function useSearchAndFilters<FiltersType>(
  initialSearch: string,
  initialFilters: FiltersType
) {
  const search = useSearch(initialSearch);
  const [filters, setFilters] = React.useState<FiltersType>(initialFilters);
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
