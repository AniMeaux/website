import { BaseSearchParams, useSearchParams } from "core/baseSearchParams";
import { ensureArray } from "core/ensureArray";
import { ActionAdornment, Adornment } from "core/formElements/adornment";
import { Input, InputProps } from "core/formElements/input";
import { forwardRef, useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import styled from "styled-components";

export type SearchParamsInputProps = Omit<
  InputProps,
  "leftAdornment" | "type" | "role"
>;

export const SearchParamsInput = forwardRef<
  HTMLInputElement,
  Omit<SearchParamsInputProps, "value" | "onChange">
>(function SearchParamsInput({ rightAdornment, ...rest }, ref) {
  const searchParams = useSearchParams(() => new QSearchParams());
  const q = searchParams.getQ();
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    const timeout = setTimeout(() => searchParams.setQ(search), 300);
    return () => clearTimeout(timeout);
  }, [search, searchParams]);

  return (
    <InputElement
      {...rest}
      type="text"
      role="search"
      ref={ref}
      value={search}
      onChange={setSearch}
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
        ...ensureArray(rightAdornment),
      ]}
    />
  );
});

const InputElement = styled(Input)`
  flex: 1;
`;

export class QSearchParams extends BaseSearchParams {
  nonFilterKeys = ["q"];

  getQ() {
    return this.get("q") ?? "";
  }

  setQ(search: string) {
    return this.set("q", search);
  }
}
