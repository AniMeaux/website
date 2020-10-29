import * as React from "react";
import { FaPlus } from "react-icons/fa";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { PageLayout } from "../../ui/layouts/pageLayout";
import { PrimaryAction } from "../../ui/primaryAction";

export default function AnimalSpeciesListPage() {
  return (
    <PageLayout
      header={
        <Header>
          <HeaderPlaceholder />
          <HeaderTitle>Races animales</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <Main hasPrimaryAction>
        <PrimaryAction>
          <FaPlus />
        </PrimaryAction>
      </Main>
    </PageLayout>
  );
}
