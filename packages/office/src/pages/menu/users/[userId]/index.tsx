import { getErrorMessage, User } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { PageComponent } from "../../../../core/pageComponent";
import { ResourceIcon } from "../../../../core/resource";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import {
  useDeleteUser,
  useToggleUserBlockedStatus,
  useUser,
} from "../../../../core/user/userQueries";
import { ButtonWithConfirmation } from "../../../../ui/button";
import { Item, ItemContent, ItemIcon, ItemMainText } from "../../../../ui/item";
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
import { UsersPage } from "../index";

function ProfileSection({ user }: { user: User }) {
  return (
    <Section>
      <SectionTitle>Profile</SectionTitle>

      <ul>
        <li>
          <Item>
            <ItemIcon>
              <FaEnvelope />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{user.email}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <ResourceIcon resourceKey="user_role" />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{user.role.name}</ItemMainText>
            </ItemContent>
          </Item>
        </li>
      </ul>
    </Section>
  );
}

function ProfilePlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <ul>
        <Placeholders count={2}>
          <li>
            <Item>
              <ItemIcon>
                <Placeholder preset="icon" />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

function ActionsSection({ user }: { user: User }) {
  const { currentUser } = useCurrentUser();
  const [deleteUser, deleteUserRequest] = useDeleteUser();
  const [
    toggleUserBlockedStatus,
    toggleUserBlockedStatusRequest,
  ] = useToggleUserBlockedStatus();

  // The current user cannot block/delete himself.
  const disabled = currentUser.id === user.id;

  return (
    <Section className="px-4">
      {toggleUserBlockedStatusRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(toggleUserBlockedStatusRequest.error)}
        </Message>
      )}

      {deleteUserRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(deleteUserRequest.error)}
        </Message>
      )}

      <ul className="space-y-4">
        <li>
          <ButtonWithConfirmation
            confirmationMessage={
              user.disabled
                ? `Êtes-vous sûr de vouloir débloquer l'utilisateur ${user.displayName} ?`
                : `Êtes-vous sûr de vouloir bloquer l'utilisateur ${user.displayName} ?`
            }
            onClick={() => toggleUserBlockedStatus(user.id)}
            color="blue"
            disabled={disabled}
            title={
              disabled
                ? "Vous ne pouvez pas bloquer votre propre utilisateur"
                : undefined
            }
            className="w-full"
          >
            {user.disabled ? "Débloquer" : "Bloquer"}
          </ButtonWithConfirmation>
        </li>

        <li>
          <ButtonWithConfirmation
            confirmationMessage={[
              `Êtes-vous sûr de vouloir supprimer l'utilisateur ${
                user!.displayName
              } ?`,
              "L'action est irréversible.",
            ].join("\n")}
            onClick={() => deleteUser(user.id)}
            color="red"
            disabled={disabled}
            title={
              disabled
                ? "Vous ne pouvez pas supprimer votre propre utilisateur"
                : undefined
            }
            className="w-full"
          >
            Supprimer
          </ButtonWithConfirmation>
        </li>
      </ul>
    </Section>
  );
}

function ActionsPlaceholderSection() {
  return (
    <Section className="px-4">
      <ul>
        <Placeholders count={2}>
          <li>
            <Placeholder preset="input" />
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

const UserPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [user, userRequest] = useUser(userId);

  const { currentUser } = useCurrentUser();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (user != null) {
    pageTitle = user.displayName;
    headerTitle = user.displayName;
  } else if (userRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (userRequest.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (user != null) {
    body = (
      <>
        <ProfileSection user={user} />
        {currentUser.role.resourcePermissions.user && (
          <>
            <Separator />
            <ActionsSection user={user} />

            <PrimaryActionLink href="edit">
              <FaPen />
            </PrimaryActionLink>
          </>
        )}
      </>
    );
  } else if (userRequest.isLoading) {
    body = (
      <>
        <ProfilePlaceholderSection />
        {currentUser.role.resourcePermissions.user && (
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
        {userRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(userRequest.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

UserPage.WrapperComponent = UsersPage;

export default UserPage;
