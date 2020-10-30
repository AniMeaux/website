import * as React from "react";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../ui/layouts/page";

export default function PartnerListPage() {
  return (
    <PageLayout
      header={
        <Header>
          <HeaderPlaceholder />
          <HeaderTitle>Partenaires</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Partenaires" />

      <Main></Main>
    </PageLayout>
  );
}
