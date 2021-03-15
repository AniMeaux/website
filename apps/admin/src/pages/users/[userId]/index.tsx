import {
  Header,
  PageComponent,
  renderQueryEntity,
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
  ButtonItem,
  HeaderTitle,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  ModalHeader,
  Placeholder,
  Placeholders,
  QuickActions,
  Section,
  SectionTitle,
  useRouter,
  withConfirmation,
} from "@animeaux/ui-library";
import * as React from "react";
import {
  FaAngleRight,
  FaBan,
  FaEnvelope,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

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
  const [toggleUserBlockedStatus] = useToggleUserBlockedStatus();

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
      className="text-yellow-600 font-medium"
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
  const [deleteUser] = useDeleteUser({
    onSuccess() {
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
      className="text-red-500 font-medium"
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
          <ModalHeader>
            <HeaderTitle>{user.displayName}</HeaderTitle>
          </ModalHeader>

          <Section>
            <LinkItem href="./edit">
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

          <hr className="mx-4 my-1 border-t border-gray-100" />

          <Section>
            <BlockUserButton user={user} />
            <DeleteUserButton user={user} />
          </Section>
        </QuickActions>
      </>
    ),
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
    </div>
  );
};

export default UserPage;
