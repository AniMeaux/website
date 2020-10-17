import * as React from "react";
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { Adornment } from "../ui/formElements/adornment";
import { Input } from "../ui/formElements/input";
import {
  Header,
  HeaderAction,
  HeaderCurrentUserAvatar,
} from "../ui/layouts/header";
import { Main } from "../ui/layouts/main";
import { PrimaryAction } from "../ui/primaryAction";

export default function AnimalListPage() {
  return (
    <>
      <Header className="border-b">
        <HeaderAction>
          <FaFilter />
        </HeaderAction>

        <Input
          type="text"
          role="search"
          placeholder="Chercher"
          className="mx-2 flex-1"
          leftAdornment={
            <Adornment>
              <FaSearch />
            </Adornment>
          }
        />

        <HeaderCurrentUserAvatar />
      </Header>

      <Main></Main>

      <PrimaryAction>
        <FaPlus />
      </PrimaryAction>
    </>
  );
}
