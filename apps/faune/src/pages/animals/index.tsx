import {
  AnimalFiltersForm,
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItem,
  SearchableAnimalItemPlaceholder,
  useAllAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import {
  AnimalFilters,
  createDefaultAnimalFilters,
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
  useSearchAndFilters,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Animaux";

const AnimalListPage: PageComponent = () => {
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
  } = useSearchAndFilters<AnimalFilters>("", createDefaultAnimalFilters());

  const activeFilterCount = getActiveAnimalFiltersCount(filters);

  const query = useAllAnimals({ search, ...filters });
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animal) => animal.id,
    hasSearch: search !== "" || activeFilterCount > 0,
    placeholderElement: SearchableAnimalItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore d'animaux",
    renderEmptySearchMessage: () => "Aucun animal trouvée",
    renderEmptySearchAction: () => (
      <Button
        variant="outlined"
        onClick={() => {
          setFilters(createDefaultAnimalFilters());
          setRawSearch("");
        }}
      >
        Effacer la recherche
      </Button>
    ),
    renderItem: (animal) => (
      <SearchableAnimalItem animal={animal} href={`./${animal.id}`} />
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
                clearAllFilters={() => setFilters(createDefaultAnimalFilters())}
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
