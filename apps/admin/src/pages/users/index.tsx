import {
  Header,
  PageComponent,
  useAllUsers,
  UserItemPlaceholder,
  UserLinkItem,
} from "@animeaux/app-core";
import { User } from "@animeaux/shared-entities";
import {
  EmptyMessage,
  Main,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <Section>
      <ul>
        <Placeholders count={5}>
          <li>
            <UserItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    </Section>
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
    <Section>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <UserLinkItem user={user} href={`./${user.id}`} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

const UserListPage: PageComponent = () => {
  const [users, query] = useAllUsers();

  let content: React.ReactNode | null = null;
  let userCount: string = "";

  if (users != null) {
    userCount = `(${users.length})`;
    content = <UsersRows users={users} />;
  } else if (query.isLoading) {
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

      <Main hasNavigation>{content}</Main>
      <Navigation />
    </div>
  );
};

export default UserListPage;
