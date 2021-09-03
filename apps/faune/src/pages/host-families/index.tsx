import { UserGroup } from "@animeaux/shared-entities";
import { QuickLinkAction } from "core/actions/quickAction";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderTitle, HeaderUserAvatar } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { usePageScrollRestoration } from "core/layouts/usePageScroll";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { PageComponent } from "core/types";
import {
  HostFamilyItemPlaceholder,
  HostFamilyLinkItem,
} from "hostFamily/hostFamilyItems";
import { useAllHostFamilies } from "hostFamily/hostFamilyQueries";
import * as React from "react";
import { FaPlus } from "react-icons/fa";

const TITLE = "Familles d'accueil";

const HostFamilyListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllHostFamilies();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (hostFamily) => hostFamily.id,
    renderPlaceholderItem: () => <HostFamilyItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de famille d'accueil",
    renderItem: (hostFamily) => (
      <HostFamilyLinkItem hostFamily={hostFamily} href={`./${hostFamily.id}`} />
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>{title}</HeaderTitle>
      </Header>

      <Main>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

HostFamilyListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyListPage;
