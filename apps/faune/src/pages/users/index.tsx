import { UserGroup } from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderItemList } from "core/request";
import { UserItemPlaceholder, UserLinkItem } from "entities/user/userItem";
import { useAllUsers } from "entities/user/userQueries";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { QuickLinkAction } from "ui/actions/quickAction";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderTitle, HeaderUserAvatar } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Section } from "ui/layouts/section";
import { usePageScrollRestoration } from "ui/layouts/usePageScroll";

const TITLE = "Utilisateurs";

const UserListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllUsers();
  const { content, title } = renderItemList(query, {
    title: TITLE,
    getItemKey: (user) => user.id,
    renderPlaceholderItem: () => <UserItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore d'utilisateur",
    renderItem: (user) => <UserLinkItem user={user} href={`./${user.id}`} />,
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

UserListPage.authorisedGroups = [UserGroup.ADMIN];

export default UserListPage;
