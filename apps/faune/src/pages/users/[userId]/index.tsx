import {
  sortGroupsByLabel,
  User,
  UserGroup,
  UserGroupLabels,
} from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { useCurrentUser } from "entities/user/currentUserContext";
import { UserGroupIcon } from "entities/user/userGroupIcon";
import {
  useDeleteUser,
  useToggleUserBlockedStatus,
  useUser,
} from "entities/user/userQueries";
import * as React from "react";
import {
  FaAngleRight,
  FaBan,
  FaEnvelope,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { QuickActions } from "ui/actions/quickAction";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "ui/dataDisplay/item";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";
import { Section, SectionTitle } from "ui/layouts/section";
import { Placeholder, Placeholders } from "ui/loaders/placeholder";
import { useModal } from "ui/popovers/modal";
import { withConfirmation } from "ui/withConfirmation";

type UserProp = {
  user: User;
};

function ProfileSection({ user }: UserProp) {
  return (
    <Section>
      <SectionTitle>Profil</SectionTitle>

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

function GroupsSection({ user }: UserProp) {
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

function BlockUserButton({ user }: UserProp) {
  const { currentUser } = useCurrentUser();
  const { onDismiss } = useModal();
  const [toggleUserBlockedStatus] = useToggleUserBlockedStatus({
    onSuccess() {
      onDismiss();
    },
  });

  // The current user cannot block himself.
  const disabled = currentUser.id === user.id;

  const confirmationMessage = user.disabled
    ? `Êtes-vous sûr de vouloir débloquer ${user.displayName} ?`
    : `Êtes-vous sûr de vouloir bloquer ${user.displayName} ?`;

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        toggleUserBlockedStatus(user.id);
      })}
      color="yellow"
      disabled={disabled}
      title={
        disabled
          ? "Vous ne pouvez pas bloquer votre propre utilisateur"
          : undefined
      }
    >
      <ItemIcon>
        <FaBan />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.disabled ? "Débloquer" : "Bloquer"}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

function DeleteUserButton({ user }: UserProp) {
  const { currentUser } = useCurrentUser();

  const router = useRouter();
  const { onDismiss } = useModal();
  const [deleteUser] = useDeleteUser({
    onSuccess() {
      onDismiss();
      router.backIfPossible("..");
    },
  });

  // The current user cannot delete himself.
  const disabled = currentUser.id === user.id;

  const confirmationMessage = [
    `Êtes-vous sûr de vouloir supprimer ${user.displayName} ?`,
    "L'action est irréversible.",
  ].join("\n");

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        deleteUser(user.id);
      })}
      color="red"
      disabled={disabled}
      title={
        disabled
          ? "Vous ne pouvez pas supprimer votre propre utilisateur"
          : undefined
      }
    >
      <ItemIcon>
        <FaTrash />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Supprimer</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

function ActionsSection({ user }: UserProp) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href="./edit" onClick={onDismiss}>
          <ItemIcon>
            <FaPen />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <hr className="mx-4 border-t border-gray-100" />

      <Section>
        <BlockUserButton user={user} />
        <DeleteUserButton user={user} />
      </Section>
    </>
  );
}

const UserPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const query = useUser(userId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (user) => user.displayName,
    renderPlaceholder: () => (
      <>
        <ProfilePlaceholderSection />
        <GroupsPlaceholderSection />
      </>
    ),
    renderEntity: (user) => (
      <>
        <ProfileSection user={user} />
        <GroupsSection user={user} />

        <QuickActions icon={FaPen}>
          <ActionsSection user={user} />
        </QuickActions>
      </>
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UserPage.authorisedGroups = [UserGroup.ADMIN];

export default UserPage;
