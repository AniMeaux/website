import { getErrorMessage, User } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { ScreenSize, useScreenSize } from "../../../core/screenSize";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { useAllUsers } from "../../../core/user/userQueries";
import { EmptyMessage } from "../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
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
import { UserAvatar } from "../../../ui/userAvatar";

type UserItemProps = {
  user: User;
  active?: boolean;
};

function UserItem({ user, active }: UserItemProps) {
  return (
    <LinkItem
      size="large"
      href={active ? "/menu/users" : `/menu/users/${user.id}`}
      active={active}
    >
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>{user.email}</ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

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
          <UserItem user={user} active={activeUserId === user.id} />
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

  const { users, isLoading, error } = useAllUsers();

  let body: React.ReactNode | null = null;
  if (users != null) {
    body = <UsersRows activeUserId={activeUserId} users={users} />;
  } else if (isLoading) {
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
        {error != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(error)}
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
