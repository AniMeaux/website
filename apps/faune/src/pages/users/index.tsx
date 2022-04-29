import { UserBrief, UserGroup } from "@animeaux/shared";
import { QuickLinkAction } from "core/actions/quickAction";
import { AvatarPlaceholder } from "core/dataDisplay/avatar";
import { EmptyMessage } from "core/dataDisplay/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem as BaseLinkItem,
} from "core/dataDisplay/item";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { ErrorPage } from "core/layouts/errorPage";
import { Header, HeaderTitle, HeaderUserAvatar } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { usePageScrollRestoration } from "core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { useOperationQuery } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { PageComponent } from "core/types";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";
import { UserAvatar } from "user/avatar";
import { USER_GROUP_LABELS } from "user/group/labels";

const TITLE = "Utilisateurs";

const UserListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllUsers = useOperationQuery({ name: "getAllUsers" });

  if (getAllUsers.state === "error") {
    return <ErrorPage status={getAllUsers.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllUsers.state === "success") {
    if (getAllUsers.result.length === 0) {
      content = <EmptyMessage>Il n'y a pas encore d'utilisateur</EmptyMessage>;
    } else {
      content = (
        <ul>
          {getAllUsers.result.map((user) => (
            <li key={user.id}>
              <UserLinkItem user={user} />
            </li>
          ))}
        </ul>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <UserItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>
          {TITLE}{" "}
          {getAllUsers.state === "success" && `(${getAllUsers.result.length})`}
        </HeaderTitle>
      </Header>

      <Main>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

UserListPage.authorisedGroups = [UserGroup.ADMIN];

export default UserListPage;

function UserItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder $preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

function UserLinkItem({ user }: { user: UserBrief }) {
  return (
    <LinkItem href={`./${user.id}`} $isDisabled={user.disabled}>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>
          {user.groups.map((group) => USER_GROUP_LABELS[group]).join(" • ")}
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

const LinkItem = styled(BaseLinkItem)<{ $isDisabled: boolean }>`
  opacity: ${(props) => (props.$isDisabled ? theme.opacity.disabled : 1)};
`;
