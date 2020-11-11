import * as React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ActionAdornment, Adornment } from "./adornment";
import { Input, InputProps } from "./input";

type SearchInputProps = Omit<InputProps, "value" | "onChange"> & {
  onSearch: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchInput({ onSearch, ...rest }: SearchInputProps) {
  const [search, setSearch] = React.useState("");
  const onSubmitRef = React.useRef(onSearch);
  onSubmitRef.current = onSearch;

  React.useEffect(() => {
    const timeout = setTimeout(() => onSubmitRef.current(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Input
      {...rest}
      type="text"
      role="search"
      value={search}
      onChange={setSearch}
      leftAdornment={
        <Adornment>
          <FaSearch />
        </Adornment>
      }
      rightAdornment={
        search !== "" && (
          <ActionAdornment onClick={() => setSearch("")}>
            <FaTimes />
          </ActionAdornment>
        )
      }
    />
  );
}
