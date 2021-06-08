import {
  createAnimalSearchFromQuery,
  createQueryFromAnimalSearch,
  getActiveAnimalFiltersCount,
  hasAnimalSearch,
  UserGroup,
} from "@animeaux/shared-entities";
import { ActionFilter } from "actions/actionFilter";
import { Button } from "actions/button";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  SearchableAnimalItemPlaceholder,
  SearchableAnimalLinkItem,
} from "entities/animal/animalItems";
import { AnimalFiltersForm } from "entities/animal/formElements/animalFiltersForm";
import { useAllAnimals } from "entities/animal/queries";
import { SearchInput, useSearchAndFilters } from "formElements/searchInput";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section, SectionTitle } from "layouts/section";
import { usePageScrollRestoration } from "layouts/usePageScroll";
import isEqual from "lodash.isequal";
import * as React from "react";

const TITLE = "Animaux";

const SearchAnimalPage: PageComponent = () => {
  const router = useRouter();
  const routerRef = React.useRef(router);
  React.useEffect(() => {
    routerRef.current = router;
  });

  usePageScrollRestoration();

  const { search, rawSearch, setRawSearch, filters, setFilters } =
    useSearchAndFilters(() => createAnimalSearchFromQuery(router.query));

  React.useEffect(() => {
    const query = createQueryFromAnimalSearch({ search, ...filters });
    if (!isEqual(query, routerRef.current.query)) {
      routerRef.current.replace({ query }, undefined, { scroll: false });
    }
  }, [search, filters]);

  const activeFilterCount = getActiveAnimalFiltersCount(filters);

  const query = useAllAnimals({ search, ...filters });
  const { content } = renderInfiniteItemList(query, {
    title: TITLE,
    hasSearch: hasAnimalSearch({ search, ...filters }),
    getItemKey: (animal) => animal.id,
    renderPlaceholderItem: () => <SearchableAnimalItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore d'animaux",
    emptySearchMessage: "Aucun animal trouvée",
    renderEmptySearchAction: () => {
      // Only show the clear filter button if there are filters to clear.
      if (activeFilterCount === 0) {
        return null;
      }

      return (
        <Button onClick={() => setFilters({})}>Effacer tous les filtres</Button>
      );
    },
    renderItem: (animal) => (
      <SearchableAnimalLinkItem animal={animal} href={`../${animal.id}`} />
    ),
  });

  let sectionTitle: React.ReactNode;
  if (query.data != null) {
    const count = query.data.pages[0].hitsTotalCount;
    if (count > 0) {
      sectionTitle = (
        <SectionTitle>
          {count} {count > 1 ? "animaux" : "animal"}
        </SectionTitle>
      );
    }
  }

  const searchInputElement = React.useRef<HTMLInputElement>(null!);

  return (
    <ApplicationLayout>
      <PageTitle title="Chercher un animal" />
      <Header>
        <HeaderBackLink href=".." />

        <SearchInput
          size="small"
          placeholder="Chercher un animal"
          value={rawSearch}
          onChange={setRawSearch}
          ref={searchInputElement}
          rightAdornment={
            <ActionFilter
              activeFilterCount={activeFilterCount}
              clearAllFilters={() => setFilters({})}
              inputRef={searchInputElement}
            >
              <AnimalFiltersForm value={filters} onChange={setFilters} />
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
