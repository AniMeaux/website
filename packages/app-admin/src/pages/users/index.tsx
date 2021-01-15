import {
  PageTitle,
  useAllUsers,
  useCurrentUser,
  UserItemPlaceholder,
  UserLinkItem,
} from "@animeaux/app-core";
import { getErrorMessage, User } from "@animeaux/shared-entities";
import {
  EmptyMessage,
  Header,
  HeaderLink,
  HeaderTitle,
  Message,
  Placeholders,
  UserAvatar,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";

function LoadingRows() {
  return (
    <ul className="px-2">
      <Placeholders count={5}>
        <li>
          <UserItemPlaceholder />
        </li>
      </Placeholders>
    </ul>
  );
}

type UsersRowsProps = {
  users: User[];
};

function UsersRows({ users }: UsersRowsProps) {
  if (users.length === 0) {
    return <EmptyMessage>Il n'y a pas encore d'utilisateur.</EmptyMessage>;
  }

  return (
    <ul className="px-2">
      {users.map((user) => (
        <li key={user.id}>
          <UserLinkItem user={user} href={`./${user.id}`} />
        </li>
      ))}
    </ul>
  );
}

export default function UserListPage() {
  const { currentUser } = useCurrentUser();
  const [users, usersRequest] = useAllUsers();

  let content: React.ReactNode | null = null;
  let userCount: React.ReactNode | null = null;

  if (users != null) {
    userCount = `(${users.length})`;
    content = <UsersRows users={users} />;
  } else if (usersRequest.isLoading) {
    content = <LoadingRows />;
  }

  return (
    <div>
      <PageTitle title="Utilisateurs" />

      <Header>
        <UserAvatar user={currentUser} />
        <HeaderTitle>Utilisateurs {userCount}</HeaderTitle>

        <HeaderLink href="./new">
          <FaPlus />
        </HeaderLink>
      </Header>

      <main className="py-4">
        {usersRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(usersRequest.error)}
          </Message>
        )}

        {content}
      </main>
    </div>
  );
}
