import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  User,
  UserRole,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPen } from "react-icons/fa";
import { useCurrentUser } from "../../../../core/user";
import { ResourceIcon, useUserRole } from "../../../../core/userRole";
import { EmptyMessage } from "../../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
} from "../../../../ui/item";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../../ui/layouts/header";
import { Main } from "../../../../ui/layouts/main";
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

      <TagList>
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

      <TagListPlaceholder />
    </Section>
  );
}

function UserItem({ user }: { user: User }) {
  return (
    <Item large>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>{user.email}</ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

function UserItemPlaceholder() {
  return (
    <Item large>
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
  const [userRole, { error, pending }] = useUserRole(userRoleId);

  const { currentUser } = useCurrentUser();
  const canEdit =
    userRole != null && currentUser.role.resourcePermissions.user_role;

  let title: React.ReactNode | null = null;
  if (userRole != null) {
    title = userRole.name;
  } else if (pending) {
    title = <Placeholder preset="text" />;
  } else if (error != null) {
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
  } else if (pending) {
    body = (
      <>
        <ResourcePermissionsPlaceholderSection />
        <Separator />
        <UsersPlaceholderSection />
      </>
    );
  }

  return (
    <>
      <Header>
        <HeaderBackLink href="/menu/user-roles" />
        <HeaderTitle>{title}</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {pending && <ProgressBar />}

      <Main hasPrimaryAction={canEdit}>
        {error != null && (
          <Message type="error" className="mx-4">
            {getErrorMessage(error)}
          </Message>
        )}

        {body}

        {canEdit && (
          <PrimaryActionLink
            href="/menu/user-roles/[userRoleId]/edit"
            as={`/menu/user-roles/${userRoleId}/edit`}
          >
            <FaPen />
          </PrimaryActionLink>
        )}
      </Main>
    </>
  );
}
