import { UserGroup } from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import {
  HostFamilyItemPlaceholder,
  HostFamilyLinkItem,
} from "entities/hostFamily/hostFamilyItems";
import { useAllHostFamilies } from "entities/hostFamily/hostFamilyQueries";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { QuickLinkAction } from "ui/actions/quickAction";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderTitle, HeaderUserAvatar } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Section } from "ui/layouts/section";
import { usePageScrollRestoration } from "ui/layouts/usePageScroll";

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
