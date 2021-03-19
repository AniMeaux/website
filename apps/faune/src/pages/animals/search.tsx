import {
  AnimalFiltersForm,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItemPlaceholder,
  SearchableAnimalLinkItem,
  useAllAnimals,
} from "@animeaux/app-core";
import {
  createAnimalSearchFromQuery,
  createQueryFromAnimalSearch,
  getActiveAnimalFiltersCount,
  hasAnimalSearch,
} from "@animeaux/shared-entities";
import {
  ActionAdornment,
  ActionFilter,
  Button,
  Header,
  HeaderBackLink,
  Main,
  SearchInput,
  Section,
  SectionTitle,
  usePageScrollRestoration,
  useRouter,
  useSearchAndFilters,
} from "@animeaux/ui-library";
import isEqual from "lodash.isequal";
import * as React from "react";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Animaux";

const SearchAnimalPage: PageComponent = () => {
  const router = useRouter();
  const routerRef = React.useRef(router);
  React.useEffect(() => {
    routerRef.current = router;
  });

  usePageScrollRestoration();

  const {
    search,
    rawSearch,
    setRawSearch,
    filters,
    setFilters,
  } = useSearchAndFilters(() => createAnimalSearchFromQuery(router.query));

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
        <Button variant="outlined" onClick={() => setFilters({})}>
          Effacer tous les filtres
        </Button>
      );
    },
    renderItem: (animal) => (
      <SearchableAnimalLinkItem
        size="small"
        animal={animal}
        href={`../${animal.id}`}
      />
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

  return (
    <div>
      <PageTitle title="Chercher un animal" />
      <Header>
        <HeaderBackLink href=".." />

        <SearchInput
          size="small"
          className="flex-1"
          placeholder="Chercher un animal"
          value={rawSearch}
          onChange={setRawSearch}
          rightAdornment={
            <ActionFilter
              actionElement={ActionAdornment}
              activeFilterCount={activeFilterCount}
              clearAllFilters={() => setFilters({})}
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
    </div>
  );
};

export default SearchAnimalPage;
