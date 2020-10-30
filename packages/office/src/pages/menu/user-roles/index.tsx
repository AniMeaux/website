import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  UserRole,
} from "@animeaux/shared";
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
import { ProgressBar } from "../../../ui/loaders/progressBar";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

type UserRoleItemProps = {
  userRole: UserRole;
};

function UserRoleItem({ userRole }: UserRoleItemProps) {
  return (
    <LinkItem large href={`/menu/user-roles/${userRole.id}`}>
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
};

function UserRolesRows({ userRoles }: UserRolesRowsProps) {
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

type UserRolesPageProps = {
  children?: React.ReactNode;
};

export default UserRolesPage;
export function UserRolesPage({ children }: UserRolesPageProps) {
  // const isStandAlonePage = children == null;
  const { screenSize } = useScreenSize();
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

      {children}
    </PageLayout>
  );
}
