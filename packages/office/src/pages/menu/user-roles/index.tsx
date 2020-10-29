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
import { Main } from "../../../ui/layouts/main";
import { PageLayout } from "../../../ui/layouts/pageLayout";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../ui/loaders/progressBar";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

function UserRoleItem({ userRole }: { userRole: UserRole }) {
  return (
    <LinkItem large href={userRole.id}>
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
    </PageLayout>
  );
}
