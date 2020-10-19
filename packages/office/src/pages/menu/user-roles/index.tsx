import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  UserRole,
} from "@animeaux/shared";
import * as React from "react";
import { FaPlus, FaShieldAlt } from "react-icons/fa";
import { useCurrentUser } from "../../../core/user";
import { useAllUserRoles } from "../../../core/userRole";
import { Avatar } from "../../../ui/avatar";
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
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main } from "../../../ui/layouts/main";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../ui/loaders/progressBar";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

function UserRoleItem({ userRole }: { userRole: UserRole }) {
  return (
    <LinkItem
      large
      href="/menu/user-roles/[userRoleId]"
      as={`/menu/user-roles/${userRole.id}`}
    >
      <ItemIcon>
        <Avatar>
          <FaShieldAlt />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{userRole.name}</ItemMainText>

        <ItemSecondaryText>
          {ResourceKeysOrder.filter((key) => userRole.resourcePermissions[key])
            .map((key) => ResourceLabels[key])
            .join(", ")}
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

function LoadingRows() {
  return (
    <Placeholders count={5}>
      <li>
        <Item large>
          <ItemIcon>
            <Placeholder preset="avatar" />
          </ItemIcon>

          <ItemContent>
            <Placeholder preset="label" />
            <Placeholder preset="text" className="text-xs" />
          </ItemContent>
        </Item>
      </li>
    </Placeholders>
  );
}

function UserRolesRows({ userRoles }: { userRoles: UserRole[] }) {
  if (userRoles.length === 0) {
    return (
      <li>
        <EmptyMessage>Il n'y a pas encore de rôle utilisateur.</EmptyMessage>
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

      <Main hasPrimaryAction={canEdit} className="px-2">
        {error != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(error)}
          </Message>
        )}

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
