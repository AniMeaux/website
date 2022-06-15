import { FosterFamilyBrief, UserGroup } from "@animeaux/shared";
import { FaHome, FaPlus, FaSearch } from "react-icons/fa";
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
import {
  Header,
  HeaderLink,
  HeaderTitle,
  HeaderUserAvatar,
} from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { PageComponent } from "~/core/types";

const TITLE = "Familles d'accueil";

const FosterFamilyListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllFosterFamilies = useOperationQuery({
    name: "getAllFosterFamilies",
  });

  if (getAllFosterFamilies.state === "error") {
    return <ErrorPage status={getAllFosterFamilies.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllFosterFamilies.state === "success") {
    if (getAllFosterFamilies.result.length === 0) {
      content = (
        <EmptyMessage>Il n'y a pas encore de famille d'accueil</EmptyMessage>
      );
    } else {
      content = (
        <ul>
          {getAllFosterFamilies.result.map((fosterFamily) => (
            <li key={fosterFamily.id}>
              <FosterFamilyLinkItem fosterFamily={fosterFamily} />
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
            <FosterFamilyItemPlaceholder />
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
          {getAllFosterFamilies.state === "success" &&
            `(${getAllFosterFamilies.result.length})`}
        </HeaderTitle>
        <HeaderLink href="./search">
          <FaSearch />
        </HeaderLink>
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

FosterFamilyListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default FosterFamilyListPage;

function FosterFamilyLinkItem({
  fosterFamily,
}: {
  fosterFamily: FosterFamilyBrief;
}) {
  return (
    <LinkItem href={`./${fosterFamily.id}`}>
      <ItemIcon>
        <Avatar>
          <FaHome />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{fosterFamily.name}</ItemMainText>
        <ItemSecondaryText>{fosterFamily.location}</ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

function FosterFamilyItemPlaceholder() {
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
