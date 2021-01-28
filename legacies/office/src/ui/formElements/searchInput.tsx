import * as React from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { Badge } from "../badge";
import { Dropdown } from "../dropdown";
import { ActionAdornment, Adornment } from "./adornment";
import { Input, InputProps } from "./input";

type SearchInputProps = Omit<InputProps, "value" | "onChange"> & {
  filters?: React.ReactNode;
  hasActiveFilters?: boolean;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchInput({
  filters,
  hasActiveFilters,
  onSearch,
  ...rest
}: SearchInputProps) {
  const [search, setSearch] = React.useState("");
  const onSubmitRef = React.useRef(onSearch);
  onSubmitRef.current = onSearch;

  React.useEffect(() => {
    const timeout = setTimeout(() => onSubmitRef.current(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const inputElement = React.useRef<HTMLInputElement>(null!);
  const filterButton = React.useRef<HTMLButtonElement>(null!);
  const [areFiltersVisible, setAreFiltersVisible] = React.useState(false);

  return (
    <>
      <Input
        {...rest}
        type="text"
        role="search"
        value={search}
        onChange={setSearch}
        refProp={inputElement}
        leftAdornment={
          <Adornment>
            <FaSearch />
          </Adornment>
        }
        rightAdornment={[
          search !== "" && (
            <ActionAdornment onClick={() => setSearch("")}>
              <FaTimes />
            </ActionAdornment>
          ),
          filters != null && (
            <ActionAdornment
              refProp={filterButton}
              onClick={() => setAreFiltersVisible(true)}
            >
              <Badge visible={hasActiveFilters}>
                <FaFilter />
              </Badge>
            </ActionAdornment>
          ),
        ]}
      />

      {areFiltersVisible && (
        <Dropdown
          actionElement={filterButton}
          referenceElement={inputElement}
          onClose={() => setAreFiltersVisible(false)}
        >
          {filters}
        </Dropdown>
      )}
    </>
  );
}
