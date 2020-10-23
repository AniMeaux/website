import * as React from "react";
import { FaPlus } from "react-icons/fa";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { PrimaryAction } from "../../ui/primaryAction";

export default function AnimalSpeciesListPage() {
  return (
    <>
      <Header>
        <HeaderPlaceholder />
        <HeaderTitle>Races animales</HeaderTitle>
        <HeaderCurrentUserAvatar />
      </Header>

      <Main hasPrimaryAction>
        <PrimaryAction>
          <FaPlus />
        </PrimaryAction>
      </Main>
    </>
  );
}
