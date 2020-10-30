import * as React from "react";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../ui/layouts/page";

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
      <PageTitle title="Races animales" />

      <Main></Main>
    </PageLayout>
  );
}
