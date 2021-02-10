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

export function useSearchValue(initialSearchValue?: string) {
  const [rawSearch, setRawSearch] = React.useState(initialSearchValue ?? "");
  const search = useDebouncedValue(rawSearch);
  return { search, rawSearch, setRawSearch };
}

export function SearchInput({
  rightAdornment,
  ...props
}: Omit<InputProps, "leftAdornment" | "type" | "role">) {
  return (
    <Input
      {...props}
      type="text"
      role="search"
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
