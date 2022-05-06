import { HostFamilyBrief, UserGroup } from "@animeaux/shared";
import { FaHome, FaPlus } from "react-icons/fa";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderTitle, HeaderUserAvatar } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { PageComponent } from "~/core/types";

const TITLE = "Familles d'accueil";

const HostFamilyListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllHostFamilies = useOperationQuery({ name: "getAllHostFamilies" });

  if (getAllHostFamilies.state === "error") {
    return <ErrorPage status={getAllHostFamilies.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllHostFamilies.state === "success") {
    if (getAllHostFamilies.result.length === 0) {
      content = (
        <EmptyMessage>Il n'y a pas encore de famille d'accueil</EmptyMessage>
      );
    } else {
      content = (
        <ul>
          {getAllHostFamilies.result.map((hostFamily) => (
            <li key={hostFamily.id}>
              <HostFamilyLinkItem hostFamily={hostFamily} />
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
            <HostFamilyItemPlaceholder />
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
          {getAllHostFamilies.state === "success" &&
            `(${getAllHostFamilies.result.length})`}
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

HostFamilyListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyListPage;

function HostFamilyLinkItem({ hostFamily }: { hostFamily: HostFamilyBrief }) {
  return (
    <LinkItem href={`./${hostFamily.id}`}>
      <ItemIcon>
        <Avatar>
          <FaHome />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{hostFamily.name}</ItemMainText>
        <ItemSecondaryText>{hostFamily.location}</ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

function HostFamilyItemPlaceholder() {
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
