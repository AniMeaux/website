import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  UserRole,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus, FaShieldAlt } from "react-icons/fa";
import { ScreenSize, useScreenSize } from "../../../core/screenSize";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { useAllUserRoles } from "../../../core/userRole/userRoleQueries";
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
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../../ui/layouts/page";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

type UserRoleItemProps = {
  userRole: UserRole;
  active?: boolean;
};

function UserRoleItem({ userRole, active }: UserRoleItemProps) {
  return (
    <LinkItem
      size="large"
      href={active ? "/menu/user-roles" : `/menu/user-roles/${userRole.id}`}
      active={active}
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
        <Item size="large">
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

type UserRolesRowsProps = {
  userRoles: UserRole[];
  activeUserRoleId: string | null;
};

function UserRolesRows({ userRoles, activeUserRoleId }: UserRolesRowsProps) {
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
          <UserRoleItem
            userRole={userRole}
            active={activeUserRoleId === userRole.id}
          />
        </li>
      ))}
    </>
  );
}

type UserRolesPageProps = {
  children?: React.ReactNode;
};

export default UserRolesPage;
export function UserRolesPage({ children }: UserRolesPageProps) {
  const router = useRouter();
  const activeUserRoleId: string | null =
    (router.query.userRoleId as string) ?? null;

  const { screenSize } = useScreenSize();
  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.user_role;

  const { userRoles, areUserRolesLoading, userRolesError } = useAllUserRoles();

  let body: React.ReactNode | null = null;
  if (userRoles != null) {
    body = (
      <UserRolesRows
        activeUserRoleId={activeUserRoleId}
        userRoles={userRoles}
      />
    );
  } else if (areUserRolesLoading) {
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

          <HeaderTitle>Rôles utilisateurs</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Rôles utilisateurs" />

      <Main className="px-2">
        {userRolesError != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(userRolesError)}
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
