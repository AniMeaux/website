import { getErrorMessage, User } from "@animeaux/shared";
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
import { Main } from "../../../ui/layouts/main";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../ui/loaders/progressBar";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";
import { UserAvatar } from "../../../ui/userAvatar";

function UserItem({ user }: { user: User }) {
  return (
    <LinkItem large href={user.id}>
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

function UsersRows({ users }: { users: User[] }) {
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
          <UserItem user={user} />
        </li>
      ))}
    </>
  );
}

export default function UsersPage() {
  const { screenSize } = useScreenSize();
  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.user;

  const [users, { pending, error }] = useAllUsers();

  let body: React.ReactNode | null = null;
  if (users != null) {
    body = <UsersRows users={users} />;
  } else if (pending) {
    body = <LoadingRows />;
  }

  return (
    <>
      <Header>
        {screenSize === ScreenSize.SMALL ? (
          <HeaderBackLink href=".." />
        ) : (
          <HeaderPlaceholder />
        )}

        <HeaderTitle>Utilisateurs</HeaderTitle>
        <HeaderCurrentUserAvatar />
      </Header>

      {pending && <ProgressBar />}

      <Main hasPrimaryAction={canEdit} className="px-2">
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
    </>
  );
}
