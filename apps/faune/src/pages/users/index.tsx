import { User, UserGroup, UserGroupLabels } from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { renderItemList } from "core/request";
import { PageComponent } from "core/types";
import { UserAvatar } from "entities/user/userAvatar";
import { UserItemPlaceholder } from "entities/user/userItem";
import { useAllUsers } from "entities/user/userQueries";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { QuickLinkAction } from "ui/actions/quickAction";
import {
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "ui/dataDisplay/item";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderTitle, HeaderUserAvatar } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Navigation } from "ui/layouts/navigation";
import { Section } from "ui/layouts/section";
import { usePageScrollRestoration } from "ui/layouts/usePageScroll";

export function UserLinkItem({ user }: { user: User }) {
  return (
    <LinkItem href={`./${user.id}`}>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>
          {user.groups.map((group) => UserGroupLabels[group]).join(" • ")}
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

const TITLE = "Utilisateurs";

const UserListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllUsers();
  const { content, title } = renderItemList(query, {
    title: TITLE,
    getItemKey: (user) => user.id,
    renderPlaceholderItem: () => <UserItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore d'utilisateur",
    renderItem: (user) => <UserLinkItem user={user} />,
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
