import {
  PageTitle,
  useCurrentUser,
  useDeleteUser,
  useToggleUserBlockedStatus,
  useUser,
} from "@animeaux/app-core";
import {
  getErrorMessage,
  sortGroupsByLabel,
  User,
  UserGroupLabels,
} from "@animeaux/shared-entities";
import {
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Message,
  Placeholder,
  Placeholders,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
  UserGroupIcon,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { Header } from "../../../core/header";
import { Navigation } from "../../../core/navigation";

function ProfileSection({ user }: { user: User }) {
  return (
    <Section>
      <SectionTitle>Profile</SectionTitle>

      <Item>
        <ItemIcon>
          <FaEnvelope />
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{user.email}</ItemMainText>
        </ItemContent>
      </Item>
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
      </ul>
    </Section>
  );
}

function GroupsSection({ user }: { user: User }) {
  return (
    <Section>
      <SectionTitle>Groupes</SectionTitle>

      <ul>
        {sortGroupsByLabel(user.groups).map((group) => (
          <li key={group}>
            <Item>
              <ItemIcon>
                <UserGroupIcon userGroup={group} />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{UserGroupLabels[group]}</ItemMainText>
              </ItemContent>
            </Item>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function GroupsPlaceholderSection() {
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

  const router = useRouter();
  const [deleteUser, deleteUserRequest] = useDeleteUser(() => {
    router.push(resolveUrl(router.asPath, "..?deleteSucceeded"));
  });

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

export default function UserPage() {
  const router = useRouter();
  const userId = router.query.userId as string;
  const updateSucceeded = router.query.updateSucceeded != null;
  const [user, userRequest] = useUser(userId);

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

  let content: React.ReactNode | null = null;

  if (user != null) {
    content = (
      <>
        <ProfileSection user={user} />
        <Separator />
        <GroupsSection user={user} />
        <Separator />
        <ActionsSection user={user} />
      </>
    );
  } else if (userRequest.isLoading) {
    content = (
      <>
        <ProfilePlaceholderSection />
        <Separator />
        <GroupsPlaceholderSection />
        <Separator />
        <ActionsPlaceholderSection />
      </>
    );
  }

  return (
    <div>
      <PageTitle title={pageTitle} />

      <Header
        headerTitle={headerTitle}
        canGoBack
        action={
          user == null
            ? undefined
            : {
                href: "./edit",
                icon: FaPen,
                label: "Modifier",
              }
        }
      />

      <Main>
        {updateSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            L'utilisateur a bien été modifié
          </Message>
        )}

        {userRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(userRequest.error)}
          </Message>
        )}

        {content}
      </Main>

      <Navigation hideOnSmallScreen />
    </div>
  );
}
