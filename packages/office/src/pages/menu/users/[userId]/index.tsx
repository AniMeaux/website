import { getErrorMessage, User } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import { useUser } from "../../../../core/user/userQueries";
import { ResourceIcon } from "../../../../core/userRole";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
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
import { UserAvatar } from "../../../../ui/userAvatar";

function MainProfileSection({ user }: { user: User }) {
  return (
    <Section className="flex flex-col items-center">
      <UserAvatar large user={user} />

      <h2 className="mt-2 text-3xl font-serif font-medium">
        {user.displayName}
      </h2>
    </Section>
  );
}

function MainProfilePlaceholderSection() {
  return (
    <Section className="flex flex-col items-center">
      <Placeholder preset="avatar" className="w-32 h-32" />
      <Placeholder preset="label" className="mt-2 text-3xl" />
    </Section>
  );
}

function SecondaryProfileSection({ user }: { user: User }) {
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
          <LinkItem href={`/menu/user-roles/${user.role.id}`}>
            <ItemIcon>
              <ResourceIcon resourceKey="user_role" />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{user.role.name}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>
      </ul>
    </Section>
  );
}

function SecondaryProfilePlaceholderSection() {
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

export default function UserPage() {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [user, userState] = useUser(userId);

  const { currentUser } = useCurrentUser();
  const canEdit = user != null && currentUser.role.resourcePermissions.user;

  let title: React.ReactNode | null = null;
  if (user != null) {
    title = user.displayName;
  } else if (userState.pending) {
    title = <Placeholder preset="text" />;
  } else if (userState.error != null) {
    title = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (user != null) {
    body = (
      <>
        <MainProfileSection user={user} />
        <Separator noBorder />
        <SecondaryProfileSection user={user} />
      </>
    );
  } else if (userState.pending) {
    body = (
      <>
        <MainProfilePlaceholderSection />
        <Separator noBorder />
        <SecondaryProfilePlaceholderSection />
      </>
    );
  }

  return (
    <>
      <Header>
        <HeaderBackLink href=".." />
        <HeaderTitle>{title}</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {userState.pending && <ProgressBar />}

      <Main hasPrimaryAction={canEdit}>
        {userState.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(userState.error)}
          </Message>
        )}

        {body}

        {canEdit && (
          <PrimaryActionLink href="edit">
            <FaPen />
          </PrimaryActionLink>
        )}
      </Main>
    </>
  );
}
