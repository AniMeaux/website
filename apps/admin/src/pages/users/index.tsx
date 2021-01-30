import {
  Header,
  useAllUsers,
  UserItemPlaceholder,
  UserLinkItem,
} from "@animeaux/app-core";
import { getErrorMessage, User } from "@animeaux/shared-entities";
import {
  EmptyMessage,
  Main,
  Message,
  MessageSection,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <ul>
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
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <UserLinkItem user={user} href={`./${user.id}`} />
        </li>
      ))}
    </ul>
  );
}

export default function UserListPage() {
  const router = useRouter();
  const deleteSucceeded = router.query.deleteSucceeded != null;
  const creationSucceeded = router.query.creationSucceeded != null;

  const [users, usersRequest] = useAllUsers();

  let content: React.ReactNode | null = null;
  let userCount: string = "";

  if (users != null) {
    userCount = `(${users.length})`;
    content = <UsersRows users={users} />;
  } else if (usersRequest.isLoading) {
    content = <LoadingRows />;
  }

  return (
    <div>
      <PageTitle title="Utilisateurs" />

      <Header
        headerTitle={`Utilisateurs ${userCount}`}
        action={{
          href: "./new",
          icon: FaPlus,
          label: "Créer un utilisateur",
        }}
      />

      <Main hasNavigation>
        {usersRequest.error != null && (
          <MessageSection>
            <Message type="error">
              {getErrorMessage(usersRequest.error)}
            </Message>
          </MessageSection>
        )}

        {deleteSucceeded && (
          <MessageSection>
            <Message type="success">L'utilisateur a bien été supprimé</Message>
          </MessageSection>
        )}

        {creationSucceeded && (
          <MessageSection>
            <Message type="success">L'utilisateur a bien été créé</Message>
          </MessageSection>
        )}

        {content != null && <Section>{content}</Section>}
      </Main>

      <Navigation />
    </div>
  );
}
