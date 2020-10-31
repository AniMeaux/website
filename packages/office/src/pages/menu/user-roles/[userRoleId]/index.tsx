import {
  getErrorMessage,
  ResourceKeysOrder,
  ResourceLabels,
  UserRole,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPen } from "react-icons/fa";
import { PageComponent } from "../../../../core/pageComponent";
import { ResourceIcon } from "../../../../core/resource";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import { UserItem } from "../../../../core/user/userItem";
import {
  useDeleteUserRole,
  useUserRole,
} from "../../../../core/userRole/userRoleQueries";
import { Button } from "../../../../ui/button";
import { EmptyMessage } from "../../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
} from "../../../../ui/item";
import { Aside, AsideLayout } from "../../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../../ui/layouts/header";
import { PageTitle } from "../../../../ui/layouts/page";
import { Section, SectionTitle } from "../../../../ui/layouts/section";
import { Placeholder, Placeholders } from "../../../../ui/loaders/placeholder";
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
import { UserRolesPage } from "../index";

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

function ActionsSection({ userRole }: { userRole: UserRole }) {
  const [onDeleteUserRole, onDeleteUserRoleState] = useDeleteUserRole();

  return (
    <Section>
      {onDeleteUserRoleState.error != null && (
        <Message type="error" className="mx-4 mb-4">
          {getErrorMessage(onDeleteUserRoleState.error)}
        </Message>
      )}

      <ul>
        <li>
          <Button
            onClick={() => {
              if (
                window.confirm(
                  `Êtes-vous sûr de vouloir supprimer le rôle utilisateur ${
                    userRole!.name
                  } ?`
                )
              ) {
                onDeleteUserRole(userRole.id);
              }
            }}
            color="red"
            className="w-full"
          >
            Supprimer
          </Button>
        </li>
      </ul>
    </Section>
  );
}

function ActionsPlaceholderSection() {
  return (
    <Section>
      <ul>
        <li>
          <Placeholder preset="input" />
        </li>
      </ul>
    </Section>
  );
}

const UserRolePage: PageComponent = () => {
  const router = useRouter();
  const userRoleId = router.query.userRoleId as string;
  const { userRole, isLoading, error } = useUserRole(userRoleId);

  const { currentUser } = useCurrentUser();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (userRole != null) {
    pageTitle = userRole.name;
    headerTitle = userRole.name;
  } else if (isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (userRole != null) {
    body = (
      <>
        <ResourcePermissionsSection userRole={userRole} />
        <Separator />
        <UsersSection userRole={userRole} />
        {currentUser.role.resourcePermissions.user_role && (
          <>
            <Separator />
            <ActionsSection userRole={userRole} />

            <PrimaryActionLink href="edit">
              <FaPen />
            </PrimaryActionLink>
          </>
        )}
      </>
    );
  } else if (isLoading) {
    body = (
      <>
        <ResourcePermissionsPlaceholderSection />
        <Separator />
        <UsersPlaceholderSection />
        {currentUser.role.resourcePermissions.user_role && (
          <>
            <Separator />
            <ActionsPlaceholderSection />
          </>
        )}
      </>
    );
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>{headerTitle}</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title={pageTitle} />

      <Aside>
        {error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

UserRolePage.WrapperComponent = UserRolesPage;

export default UserRolePage;
