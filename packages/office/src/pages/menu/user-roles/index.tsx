import {
  Link,
  ResourceKeysOrder,
  ResourceLabels,
  UserRole,
} from "@animeaux/shared";
import * as React from "react";
import { FaPlus, FaShieldAlt } from "react-icons/fa";
import { useCurrentUser } from "../../../core/user";
import { useAllUserRoles } from "../../../core/userRole";
import { Avatar } from "../../../ui/avatar";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main } from "../../../ui/layouts/main";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../ui/loaders/progressBar";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

type ItemProps = {
  avatar: React.ReactNode;
  children: React.ReactNode;
};

function Item({ avatar, children }: ItemProps) {
  return (
    <span className="h-16 px-2 flex items-center">
      <span className="mr-4 flex-none">{avatar}</span>
      <span className="flex-1 min-w-0 flex flex-col">{children}</span>
    </span>
  );
}

function UserRoleItem({ userRole }: { userRole: UserRole }) {
  return (
    <Link
      href="/menu/user-roles/[userRoleId]"
      as={`/menu/user-roles/${userRole.id}`}
      className="flex flex-col"
    >
      <Item
        avatar={
          <Avatar>
            <FaShieldAlt />
          </Avatar>
        }
      >
        <span className="truncate">{userRole.name}</span>

        <span className="truncate text-xs text-gray-600">
          {ResourceKeysOrder.filter((key) => userRole.resourcePermissions[key])
            .map((key) => ResourceLabels[key])
            .join(", ")}
        </span>
      </Item>
    </Link>
  );
}

function LoadingRows() {
  return (
    <Placeholders count={5}>
      <li>
        <Item avatar={<Placeholder preset="avatar" />}>
          <Placeholder preset="label" />
          <Placeholder preset="text" className="text-xs" />
        </Item>
      </li>
    </Placeholders>
  );
}

function UserRolesRows({ userRoles }: { userRoles: UserRole[] }) {
  if (userRoles.length === 0) {
    return (
      <li>
        <p className="px-2 py-4 text-sm text-gray-600 text-center">
          Il n'y a pas encore de rôle utilisateur.
        </p>
      </li>
    );
  }

  return (
    <>
      {userRoles.map((userRole) => (
        <li key={userRole.id}>
          <UserRoleItem userRole={userRole} />
        </li>
      ))}
    </>
  );
}

export default function UserRolesPage() {
  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.user_role;

  const [userRoles, { pending, error }] = useAllUserRoles();

  let body: React.ReactNode | null = null;
  if (userRoles != null) {
    body = <UserRolesRows userRoles={userRoles} />;
  } else if (pending) {
    body = <LoadingRows />;
  }

  return (
    <>
      <Header>
        <HeaderBackLink href="/menu" />
        <HeaderTitle>Rôles utilisateurs</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {pending && <ProgressBar />}

      <Main className="px-2">
        {error != null && <Message type="error">{error.message}</Message>}

        <ul>{body}</ul>

        {canEdit && (
          <PrimaryActionLink href="/menu/user-roles/new">
            <FaPlus />
          </PrimaryActionLink>
        )}
      </Main>
    </>
  );
}
