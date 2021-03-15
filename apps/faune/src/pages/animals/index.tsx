import {
  AnimalFiltersForm,
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalLinkItem,
  SearchableAnimalItemPlaceholder,
  useAllAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import {
  createAnimalFilters,
  createAnimalFiltersFromQuery,
  createAnimalFiltersQuery,
  doesGroupsIntersect,
  getActiveAnimalFiltersCount,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  ActionAdornment,
  ActionFilter,
  Button,
  Field,
  Main,
  QuickLinkAction,
  SearchInput,
  usePageScrollRestoration,
  useRouter,
  useSearchAndFilters,
} from "@animeaux/ui-library";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Animaux";

const AnimalListPage: PageComponent = () => {
  const router = useRouter();
  const routerRef = React.useRef(router);
  React.useEffect(() => {
    routerRef.current = router;
  });

  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const {
    search,
    rawSearch,
    setRawSearch,
    filters,
    setFilters,
  } = useSearchAndFilters(() => createAnimalFiltersFromQuery(router.query));

  React.useEffect(() => {
    const query = createAnimalFiltersQuery(search, filters);
    if (!isEqual(query, routerRef.current.query)) {
      routerRef.current.replace({ query });
    }
  }, [search, filters]);

  const activeFilterCount = getActiveAnimalFiltersCount(filters);

  const query = useAllAnimals({ search, ...filters });
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animal) => animal.id,
    hasSearch: search !== "" || activeFilterCount > 0,
    placeholderElement: SearchableAnimalItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore d'animaux",
    renderEmptySearchMessage: () => "Aucun animal trouvée",
    renderEmptySearchAction: () => {
      // Only show the clear filter button if there are filters to clear.
      if (isEmpty(filters)) {
        return null;
      }

      return (
        <Button variant="outlined" onClick={() => setFilters({})}>
          Effacer tous les filtres
        </Button>
      );
    },
    renderItem: (animal) => (
      <SearchableAnimalLinkItem animal={animal} href={`./${animal.id}`} />
    ),
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main hasNavigation={isCurrentUserAdmin}>
        <Field>
          <SearchInput
            placeholder="Chercher un animal"
            value={rawSearch}
            onChange={setRawSearch}
            rightAdornment={
              <ActionFilter
                actionElement={ActionAdornment}
                activeFilterCount={activeFilterCount}
                clearAllFilters={() => setFilters(createAnimalFilters())}
              >
                <AnimalFiltersForm value={filters} onChange={setFilters} />
              </ActionFilter>
            }
          />
        </Field>

        {content}

        {isCurrentUserAdmin && (
          <QuickLinkAction href="./new/profile">
            <FaPlus />
          </QuickLinkAction>
        )}
      </Main>

      {isCurrentUserAdmin && <Navigation />}
    </div>
  );
};

export default AnimalListPage;
