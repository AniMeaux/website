import {
  Header,
  PageComponent,
  renderItemList,
  useAllUsers,
  UserItemPlaceholder,
  UserLinkItem,
} from "@animeaux/app-core";
import {
  Main,
  QuickLinkAction,
  Section,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Utilisateurs";

const UserListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllUsers();
  const { content, title } = renderItemList(query, {
    title: TITLE,
    getItemKey: (user) => user.id,
    placeholderElement: UserItemPlaceholder,
    emptyMessage: "Il n'y a pas encore d'utilisateur",
    renderItem: (user) => <UserLinkItem user={user} href={`./${user.id}`} />,
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main hasNavigation>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>
      <Navigation />
    </div>
  );
};

export default UserListPage;
