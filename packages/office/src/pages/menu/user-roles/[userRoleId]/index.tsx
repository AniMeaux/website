import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  User,
  UserRole,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { ResourceIcon } from "../../../../core/resource";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import {
  useDeleteUserRole,
  useUserRole,
} from "../../../../core/userRole/userRoleQueries";
import { EmptyMessage } from "../../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "../../../../ui/item";
import {
  Header,
  HeaderAction,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../../ui/layouts/header";
import { Main } from "../../../../ui/layouts/main";
import { PageLayout } from "../../../../ui/layouts/pageLayout";
import { Section, SectionTitle } from "../../../../ui/layouts/section";
import { Placeholder, Placeholders } from "../../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../../ui/loaders/progressBar";
import { Message } from "../../../../ui/message";
import { PrimaryActionLink } from "../../../../ui/primaryAction";
import { Separator } from "../../../../ui/separator";
import {
  Tag,
  TagIcon,
  TagList,
  TagListItem,
  TagListPlaceholder,
  TagText,
} from "../../../../ui/tag";
import { UserAvatar } from "../../../../ui/userAvatar";

function ResourcePermissionsSection({ userRole }: { userRole: UserRole }) {
  const resourcesKey = ResourceKeysOrder.filter(
    (key) => userRole.resourcePermissions[key]
  );

  return (
    <Section>
      <SectionTitle>Ressources pouvant être modifiées</SectionTitle>
      {resourcesKey.length === 0 && <EmptyMessage>Aucune</EmptyMessage>}

      <TagList className="px-1">
        {resourcesKey.map((key) => (
          <TagListItem key={key}>
            <Tag>
              <TagIcon>
                <ResourceIcon resourceKey={key} />
              </TagIcon>

              <TagText>{ResourceLabels[key]}</TagText>
            </Tag>
          </TagListItem>
        ))}
      </TagList>
    </Section>
  );
}

function ResourcePermissionsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <TagListPlaceholder className="px-1" />
    </Section>
  );
}

function UserItem({ user }: { user: User }) {
  return (
    <LinkItem large href={`/menu/users/${user.id}`}>
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

function UserItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

function UsersSection({ userRole }: { userRole: UserRole }) {
  return (
    <Section>
      <SectionTitle>Utilisateurs avec ce rôle</SectionTitle>
      {userRole.users.length === 0 && <EmptyMessage>Aucun</EmptyMessage>}

      <ul>
        {userRole.users.map((user) => (
          <li key={user.id}>
            <UserItem user={user} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function UsersPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <ul>
        <Placeholders>
          <li>
            <UserItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

export default function UserRolePage() {
  const router = useRouter();
  const userRoleId = router.query.userRoleId as string;
  const [userRole, userRoleState] = useUserRole(userRoleId);

  const [onDeleteUserRole, onDeleteUserRoleState] = useDeleteUserRole(
    userRoleId
  );

  const { currentUser } = useCurrentUser();
  const canEdit =
    userRole != null && currentUser.role.resourcePermissions.user_role;

  let title: React.ReactNode | null = null;
  if (userRole != null) {
    title = userRole.name;
  } else if (userRoleState.pending) {
    title = <Placeholder preset="text" />;
  } else if (userRoleState.error != null) {
    title = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (userRole != null) {
    body = (
      <>
        <ResourcePermissionsSection userRole={userRole} />
        <Separator />
        <UsersSection userRole={userRole} />
      </>
    );
  } else if (userRoleState.pending) {
    body = (
      <>
        <ResourcePermissionsPlaceholderSection />
        <Separator />
        <UsersPlaceholderSection />
      </>
    );
  }

  return (
    <PageLayout
      header={
        <Header>
          <HeaderBackLink href=".." />
          <HeaderTitle>{title}</HeaderTitle>

          {canEdit ? (
            <HeaderAction
              variant="secondary"
              color="red"
              onClick={() => {
                if (
                  window.confirm(
                    `Êtes-vous sûr de vouloir supprimer le rôle utilisateur ${
                      userRole!.name
                    } ?`
                  )
                ) {
                  onDeleteUserRole();
                }
              }}
            >
              <FaTrash />
            </HeaderAction>
          ) : (
            <HeaderPlaceholder />
          )}
        </Header>
      }
    >
      {(userRoleState.pending || onDeleteUserRoleState.pending) && (
        <ProgressBar />
      )}

      <Main hasPrimaryAction={canEdit}>
        {userRoleState.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(userRoleState.error)}
          </Message>
        )}

        {onDeleteUserRoleState.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(onDeleteUserRoleState.error)}
          </Message>
        )}

        {body}

        {canEdit && (
          <PrimaryActionLink href="edit">
            <FaPen />
          </PrimaryActionLink>
        )}
      </Main>
    </PageLayout>
  );
}
