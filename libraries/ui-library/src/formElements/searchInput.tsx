import * as React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ensureArray } from "../ensureArray";
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
  const inputElement = React.useRef<HTMLInputElement>(null!);
  const previousFocusOwner = React.useRef<HTMLElement | null>(null);

  return (
    <Input
      {...props}
      type="text"
      role="search"
      ref={inputElement}
      leftAdornment={
        <Adornment>
          <FaSearch />
        </Adornment>
      }
      rightAdornment={[
        props.value !== "" && (
          <ActionAdornment
            onFocus={(event) => {
              // Get the element which just lost the focus.
              previousFocusOwner.current = event.relatedTarget as HTMLElement;
            }}
            onClick={() => {
              props.onChange?.("");

              // Give the focus back to the input to avoid loosing the keyboard
              // on mobile apps.
              if (previousFocusOwner.current === inputElement.current) {
                inputElement.current.focus();
              }
            }}
          >
            <FaTimes />
          </ActionAdornment>
        ),
        ...ensureArray(rightAdornment),
      ]}
    />
  );
}
