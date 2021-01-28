import * as React from "react";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../ui/layouts/page";

export default function ArticleListPage() {
  return (
    <PageLayout
      header={
        <Header>
          <HeaderPlaceholder />
          <HeaderTitle>Articles</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Articles" />

      <Main></Main>
    </PageLayout>
  );
}
