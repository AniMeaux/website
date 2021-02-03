import {
  Header,
  PageComponent,
  useCurrentUser,
  useDeleteUser,
  UserGroupIcon,
  useToggleUserBlockedStatus,
  useUser,
} from "@animeaux/app-core";
import {
  sortGroupsByLabel,
  User,
  UserGroupLabels,
} from "@animeaux/shared-entities";
import {
  ActionSection,
  ActionSectionList,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Placeholder,
  Placeholders,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

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
  const [deleteUser] = useDeleteUser({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  const [toggleUserBlockedStatus] = useToggleUserBlockedStatus();

  // The current user cannot block/delete himself.
  const disabled = currentUser.id === user.id;

  return (
    <ActionSection>
      <ActionSectionList>
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
        >
          {user.disabled ? "Débloquer" : "Bloquer"}
        </ButtonWithConfirmation>

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
        >
          Supprimer
        </ButtonWithConfirmation>
      </ActionSectionList>
    </ActionSection>
  );
}

function ActionsPlaceholderSection() {
  return (
    <ActionSection>
      <ActionSectionList>
        <Placeholders count={2}>
          <Placeholder preset="button" />
        </Placeholders>
      </ActionSectionList>
    </ActionSection>
  );
}

const UserPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [user, { error, isLoading }] = useUser(userId);

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (user != null) {
    pageTitle = user.displayName;
    headerTitle = user.displayName;
  } else if (isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (error != null) {
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
  } else if (isLoading) {
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

      <Main>{content}</Main>
    </div>
  );
};

export default UserPage;
