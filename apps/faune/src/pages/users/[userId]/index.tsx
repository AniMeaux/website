import { User, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import {
  FaAngleRight,
  FaBan,
  FaEnvelope,
  FaExclamationTriangle,
  FaPen,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useCurrentUser } from "~/account/currentUser";
import { QuickActions } from "~/core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { AvatarImage } from "~/core/dataDisplay/image";
import { Info } from "~/core/dataDisplay/info";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section, SectionTitle } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import {
  OperationMutationResponse,
  useOperationMutation,
  useOperationQuery,
} from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useModal } from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { UserGroupIcon } from "~/user/group/icon";
import { USER_GROUP_LABELS } from "~/user/group/labels";

const UserPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.userId === "string",
    `The userId path should be a string. Got '${typeof router.query.userId}'`
  );

  const getUser = useOperationQuery({
    name: "getUser",
    params: { id: router.query.userId },
  });

  const toggleUserBlockedStatus = useOperationMutation(
    "toggleUserBlockedStatus",
    {
      onSuccess: (response, cache) => {
        cache.set(
          { name: "getUser", params: { id: response.result.id } },
          response.result
        );

        cache.invalidate({ name: "getAllUsers" });
      },
    }
  );

  const deleteUser = useOperationMutation("deleteUser", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getUser",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllUsers" });
      router.backIfPossible("..");
    },
  });

  if (getUser.state === "error") {
    return <ErrorPage status={getUser.status} />;
  }

  let content: React.ReactNode = null;

  if (getUser.state === "success") {
    content = (
      <>
        {toggleUserBlockedStatus.state === "error" && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getUser.result.displayName} n'a pas pu être{" "}
              {getUser.result.disabled ? "débloqué" : "bloqué"}.
            </Info>
          </Section>
        )}

        {deleteUser.state === "error" && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getUser.result.displayName} n'a pas pu être supprimé.
            </Info>
          </Section>
        )}

        {getUser.result.disabled && (
          <Section>
            <Info variant="warning" icon={<FaExclamationTriangle />}>
              {getUser.result.displayName} est actuellement bloqué.
            </Info>
          </Section>
        )}

        <ProfileSection user={getUser.result} />
        <GroupsSection user={getUser.result} />
        <ManagedAnimalsSection user={getUser.result} />

        <QuickActions icon={<FaPen />}>
          <ActionsSection
            user={getUser.result}
            toggleUserBlockedStatus={toggleUserBlockedStatus}
            deleteUser={deleteUser}
          />
        </QuickActions>
      </>
    );
  } else {
    content = (
      <>
        <ProfilePlaceholderSection />
        <GroupsPlaceholderSection />
        <ManagedAnimalsPlaceholderSection />
      </>
    );
  }

  const displayName =
    getUser.state === "success" ? getUser.result.displayName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={displayName} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>
          {displayName ?? <Placeholder $preset="text" />}
        </HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UserPage.authorisedGroups = [UserGroup.ADMIN];

export default UserPage;

type UserProp = { user: User };

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
        <Placeholder $preset="text" />
      </SectionTitle>

      <ul>
        <li>
          <Item>
            <ItemIcon>
              <Placeholder $preset="icon" />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                <Placeholder $preset="label" />
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
        {user.groups.map((group) => (
          <li key={group}>
            <Item>
              <ItemIcon>
                <UserGroupIcon userGroup={group} />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{USER_GROUP_LABELS[group]}</ItemMainText>
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
        <Placeholder $preset="text" />
      </SectionTitle>

      <ul>
        <Placeholders count={2}>
          <li>
            <Item>
              <ItemIcon>
                <Placeholder $preset="icon" />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder $preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

function ManagedAnimalsSection({ user }: UserProp) {
  if (user.managedAnimals.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionTitle>
        Animaux en charges{" "}
        {user.managedAnimals.length > 0 && ` (${user.managedAnimals.length})`}
      </SectionTitle>

      <ul>
        {user.managedAnimals.map((animal) => (
          <li key={animal.id}>
            <LinkItem href={`/animals/${animal.id}`}>
              <ItemIcon>
                <Avatar>
                  <AvatarImage image={animal.avatarId} alt={animal.name} />
                </Avatar>
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{animal.name}</ItemMainText>
              </ItemContent>
            </LinkItem>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ManagedAnimalsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder $preset="label" />
      </SectionTitle>

      <ul>
        <Placeholders count={3}>
          <li>
            <Item>
              <ItemIcon>
                <AvatarPlaceholder />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder $preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

type BlockUserButtonProps = UserProp & {
  toggleUserBlockedStatus: OperationMutationResponse<"toggleUserBlockedStatus">;
};

function BlockUserButton({
  user,
  toggleUserBlockedStatus,
}: BlockUserButtonProps) {
  const { currentUser } = useCurrentUser();
  const { onDismiss } = useModal();

  // The current user cannot block himself.
  const disabled = currentUser.id === user.id;

  return (
    <ButtonItem
      onClick={() => {
        if (toggleUserBlockedStatus.state !== "loading") {
          const confirmationMessage = user.disabled
            ? `Êtes-vous sûr de vouloir débloquer ${user.displayName} ?`
            : `Êtes-vous sûr de vouloir bloquer ${user.displayName} ?`;

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            toggleUserBlockedStatus.mutate({ id: user.id });
          }
        }
      }}
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

type ActionsSectionProps = UserProp & {
  toggleUserBlockedStatus: OperationMutationResponse<"toggleUserBlockedStatus">;
  deleteUser: OperationMutationResponse<"deleteUser">;
};

function ActionsSection({
  user,
  toggleUserBlockedStatus,
  deleteUser,
}: ActionsSectionProps) {
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

      <Separator />

      <Section>
        <BlockUserButton
          user={user}
          toggleUserBlockedStatus={toggleUserBlockedStatus}
        />

        <DeleteUserButton user={user} deleteUser={deleteUser} />
      </Section>
    </>
  );
}

type DeleteUserButtonProps = UserProp & {
  deleteUser: OperationMutationResponse<"deleteUser">;
};

function DeleteUserButton({ user, deleteUser }: DeleteUserButtonProps) {
  const { currentUser } = useCurrentUser();
  const { onDismiss } = useModal();

  // The current user cannot delete himself.
  const disabled = currentUser.id === user.id;

  return (
    <ButtonItem
      onClick={() => {
        if (deleteUser.state !== "loading") {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${user.displayName} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteUser.mutate({ id: user.id });
          }
        }
      }}
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
