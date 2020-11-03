import { getErrorMessage, User } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { ScreenSize, useScreenSize } from "../../../core/screenSize";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { UserLinkItem } from "../../../core/user/userItem";
import { useAllUsers } from "../../../core/user/userQueries";
import { EmptyMessage } from "../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
} from "../../../ui/item";
import {
  Header,
  HeaderBackLink,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../../ui/layouts/page";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

function LoadingRows() {
  return (
    <Placeholders count={5}>
      <li>
        <Item size="large">
          <ItemIcon>
            <Placeholder preset="avatar" />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>
              <Placeholder preset="label" />
            </ItemMainText>

            <ItemSecondaryText>
              <Placeholder preset="text" className="text-xs" />
            </ItemSecondaryText>
          </ItemContent>
        </Item>
      </li>
    </Placeholders>
  );
}

type UsersRowsProps = {
  users: User[];
  activeUserId: string | null;
};

function UsersRows({ users, activeUserId }: UsersRowsProps) {
  if (users.length === 0) {
    return (
      <li>
        <EmptyMessage>Il n'y a pas encore d'utilisateur.</EmptyMessage>
      </li>
    );
  }

  return (
    <>
      {users.map((user) => (
        <li key={user.id}>
          <UserLinkItem user={user} active={activeUserId === user.id} />
        </li>
      ))}
    </>
  );
}

type UserPageProps = {
  children?: React.ReactNode;
};

export default UsersPage;
export function UsersPage({ children }: UserPageProps) {
  const router = useRouter();
  const activeUserId: string | null = (router.query.userId as string) ?? null;

  const { screenSize } = useScreenSize();
  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.user;

  const { users, areUsersLoading, usersError } = useAllUsers();

  let body: React.ReactNode | null = null;
  if (users != null) {
    body = <UsersRows activeUserId={activeUserId} users={users} />;
  } else if (areUsersLoading) {
    body = <LoadingRows />;
  }

  return (
    <PageLayout
      header={
        <Header>
          {screenSize === ScreenSize.SMALL ? (
            <HeaderBackLink href=".." />
          ) : (
            <HeaderPlaceholder />
          )}

          <HeaderTitle>Utilisateurs</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Utilisateurs" />

      <Main className="px-2">
        {usersError != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(usersError)}
          </Message>
        )}

        <ul>{body}</ul>

        {canEdit && (
          <PrimaryActionLink href="./new">
            <FaPlus />
          </PrimaryActionLink>
        )}
      </Main>

      {children}
    </PageLayout>
  );
}
