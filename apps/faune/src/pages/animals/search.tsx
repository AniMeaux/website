import { AnimalSearchHit, UserGroup } from "@animeaux/shared";
import { AnimalFiltersModal } from "animal/filtersModal";
import { AnimalSearchParams } from "animal/searchParams";
import { StatusBadge } from "animal/status/badge";
import { StatusIcon } from "animal/status/icon";
import { ActionFilter } from "core/actions/actionFilter";
import { Button } from "core/actions/button";
import { useSearchParams } from "core/baseSearchParams";
import { Avatar, AvatarPlaceholder } from "core/dataDisplay/avatar";
import { EmptyMessage } from "core/dataDisplay/emptyMessage";
import { AvatarImage } from "core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import { Markdown } from "core/dataDisplay/markdown";
import { SearchParamsInput } from "core/formElements/searchParamsInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { ErrorPage } from "core/layouts/errorPage";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section, SectionTitle } from "core/layouts/section";
import { usePageScrollRestoration } from "core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { usePaginatedOperationQuery } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import { useRef } from "react";

const TITLE = "Chercher un animal";

const SearchAnimalPage: PageComponent = () => {
  usePageScrollRestoration();

  const searchInputElement = useRef<HTMLInputElement>(null!);

  const searchParams = useSearchParams(() => new AnimalSearchParams());
  const searchAnimals = usePaginatedOperationQuery({
    name: "searchAnimals",
    params: {
      search: searchParams.getQ(),
      species: searchParams.getSpecies(),
      status: searchParams.getStatus(),
    },
  });

  if (searchAnimals.state === "error") {
    return <ErrorPage status={searchAnimals.status} />;
  }

  let sectionTitle: React.ReactNode;
  let content: React.ReactNode;

  if (searchAnimals.state === "success") {
    // There is allways at least one page.
    if (searchAnimals.results[0].hitsTotalCount === 0) {
      let action: React.ReactNode;

      if (searchParams.getFilterCount() > 0) {
        action = (
          <Button onClick={() => searchParams.deleteAllFilters()}>
            Effacer tous les filtres
          </Button>
        );
      }

      content = (
        <EmptyMessage action={action}>Aucun animal trouvée</EmptyMessage>
      );
    } else {
      const itemsNode: React.ReactNode[] = [];

      searchAnimals.results.forEach((result) => {
        result.hits.forEach((animal) => {
          itemsNode.push(
            <li key={animal.id}>
              <AnimalItem animal={animal} />
            </li>
          );
        });
      });

      content = (
        <ul>
          {itemsNode}
          {searchAnimals.isFetchingNextPage && (
            <li>
              <AnimalItemPlaceholder />
            </li>
          )}
        </ul>
      );

      sectionTitle = (
        <SectionTitle>
          {searchAnimals.results[0].hitsTotalCount}{" "}
          {searchAnimals.results[0].hitsTotalCount > 1 ? "animaux" : "animal"}
        </SectionTitle>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <AnimalItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderBackLink />

        <SearchParamsInput
          placeholder="Chercher un animal"
          ref={searchInputElement}
          rightAdornment={
            <ActionFilter
              hasFilters={searchParams.getFilterCount() > 0}
              inputRef={searchInputElement}
            >
              <AnimalFiltersModal />
            </ActionFilter>
          }
        />
      </Header>

      <Main>
        <Section>
          {sectionTitle}
          {content}
        </Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

SearchAnimalPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default SearchAnimalPage;

function AnimalItemPlaceholder() {
  return (
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
  );
}

function AnimalItem({ animal }: { animal: AnimalSearchHit }) {
  const { screenSize } = useScreenSize();

  return (
    <LinkItem href={`../${animal.id}`}>
      <ItemIcon>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={animal.displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{animal.highlightedDisplayName}</Markdown>
        </ItemMainText>
      </ItemContent>

      <ItemIcon small>
        {screenSize <= ScreenSize.SMALL ? (
          <StatusIcon status={animal.status} />
        ) : (
          <StatusBadge isSmall status={animal.status} />
        )}
      </ItemIcon>
    </LinkItem>
  );
}
