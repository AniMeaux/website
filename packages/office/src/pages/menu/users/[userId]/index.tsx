import { getErrorMessage, User } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaPen } from "react-icons/fa";
import { PageComponent } from "../../../../core/pageComponent";
import { ResourceIcon } from "../../../../core/resource";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import { useUser } from "../../../../core/user/userQueries";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
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
import { UserAvatar } from "../../../../ui/userAvatar";
import { UsersPage } from "../index";

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

const UserPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { user, isLoading, error } = useUser(userId);

  const { currentUser } = useCurrentUser();

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

  let body: React.ReactNode | null = null;
  if (user != null) {
    body = (
      <>
        <MainProfileSection user={user} />
        <Separator noBorder />
        <SecondaryProfileSection user={user} />
        {currentUser.role.resourcePermissions.user && (
          <PrimaryActionLink href="edit">
            <FaPen />
          </PrimaryActionLink>
        )}
      </>
    );
  } else if (isLoading) {
    body = (
      <>
        <MainProfilePlaceholderSection />
        <Separator noBorder />
        <SecondaryProfilePlaceholderSection />
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

UserPage.WrapperComponent = UsersPage;

export default UserPage;
