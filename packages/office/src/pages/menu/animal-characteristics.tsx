import * as React from "react";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../ui/layouts/page";

export default function AnimalCharacteristicsListPage() {
  return (
    <PageLayout
      header={
        <Header>
          <HeaderPlaceholder />
          <HeaderTitle>Caractéristiques animales</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Caractéristiques animales" />

      <Main></Main>
    </PageLayout>
  );
}
