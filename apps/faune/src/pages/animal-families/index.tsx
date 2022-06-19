import { UserGroup } from "@prisma/client";
import { FaPlus, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { AnimalFamilyItem } from "~/animal/families/item";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
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
import { Placeholders } from "~/core/loaders/placeholder";
import { usePaginatedOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { PageComponent } from "~/core/types";
import { theme } from "~/styles/theme";

const TITLE = "Relations";

const AnimalFamilyListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllAnimalFamilies = usePaginatedOperationQuery({
    name: "getAllAnimalFamilies",
    // TODO: Handle pagination.
    params: {},
  });

  if (getAllAnimalFamilies.state === "error") {
    return <ErrorPage status={getAllAnimalFamilies.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllAnimalFamilies.state === "success") {
    // There is allways at least one page.
    if (getAllAnimalFamilies.results[0].hitsTotalCount === 0) {
      content = <EmptyMessage>Il n'y a pas encore de relations</EmptyMessage>;
    } else {
      const itemsNode: React.ReactNode[] = [];

      getAllAnimalFamilies.results.forEach((result) => {
        result.hits.forEach((family) => {
          itemsNode.push(
            <li key={family.id}>
              <AnimalFamilyItem family={family} />
            </li>
          );
        });
      });

      content = (
        <AnimalFamilyItemList>
          {itemsNode}
          {getAllAnimalFamilies.isFetchingNextPage && (
            <li>
              <AnimalFamilyItemPlaceholder />
            </li>
          )}
        </AnimalFamilyItemList>
      );
    }
  } else {
    content = (
      <AnimalFamilyItemList>
        <Placeholders count={2}>
          <li>
            <AnimalFamilyItemPlaceholder />
          </li>
        </Placeholders>
      </AnimalFamilyItemList>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>
          {TITLE}{" "}
          {getAllAnimalFamilies.state === "success" &&
            `(${getAllAnimalFamilies.results[0].hitsTotalCount})`}
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

AnimalFamilyListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default AnimalFamilyListPage;

const AnimalFamilyItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x4};
`;

function AnimalFamilyItemPlaceholder() {
  // TODO
  return null;
}
