import {
  Header,
  HostFamilyItem,
  HostFamilyItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  useAllHostFamilies,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import {
  Main,
  QuickLinkAction,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Familles d'accueil";

const HostFamilyListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllHostFamilies();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (hostFamily) => hostFamily.id,
    placeholderElement: HostFamilyItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore de famille d'accueil.",
    renderItem: (hostFamily) => (
      <HostFamilyItem hostFamily={hostFamily} href={`./${hostFamily.id}`} />
    ),
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main>
        {content}

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>
    </div>
  );
};

HostFamilyListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyListPage;
