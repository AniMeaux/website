import {
  AnimalSearch,
  getActiveAnimalFiltersCount,
  getAnimalDisplayName,
  hasAnimalSearch,
  isAnimalSpecies,
  isAnimalStatus,
  SearchableAnimal,
  UserGroup,
} from "@animeaux/shared-entities";
import { AnimalFiltersForm } from "animal/formElements/animalFiltersForm";
import { useAllAnimals } from "animal/queries";
import { ActionFilter } from "core/actions/actionFilter";
import { Button } from "core/actions/button";
import { Avatar } from "core/dataDisplay/avatar";
import { AvatarImage } from "core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import {
  SearchInput,
  useSearchAndFilters,
} from "core/formElements/searchInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section, SectionTitle } from "core/layouts/section";
import { usePageScrollRestoration } from "core/layouts/usePageScroll";
import { Placeholder } from "core/loaders/placeholder";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import isEqual from "lodash.isequal";
import { useEffect, useRef } from "react";

export function SearchableAnimalItemPlaceholder() {
  const { screenSize } = useScreenSize();

  return (
    <Item>
      <ItemIcon>
        <Placeholder
          preset={screenSize <= ScreenSize.MEDIUM ? "avatar-small" : "avatar"}
        />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

export function SearchableAnimalLinkItem({
  animal,
}: {
  animal: SearchableAnimal;
}) {
  const { screenSize } = useScreenSize();
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem href={`../${animal.id}`}>
      <ItemIcon>
        <Avatar isSmall={screenSize <= ScreenSize.MEDIUM}>
          <AvatarImage image={animal.avatarId} alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}

function createQueryFromAnimalSearch(animalSearch: AnimalSearch) {
  const query = new URLSearchParams();

  if (animalSearch.search != null && animalSearch.search !== "") {
    query.set("q", animalSearch.search);
  }

  if (animalSearch.status != null) {
    animalSearch.status.forEach((status) => {
      query.append("status", status);
    });
  }

  if (animalSearch.species != null) {
    animalSearch.species.forEach((species) => {
      query.append("species", species);
    });
  }

  if (animalSearch.hostFamilyId != null) {
    query.set("hostFamilyId", animalSearch.hostFamilyId);
  }

  const href = query.toString();
  return href === "" ? "" : `?${href}`;
}

function createAnimalSearchFromQuery() {
  const query = new URLSearchParams(window.location.search);
  const animalSearch: AnimalSearch = {
    search: query.get("q"),
    status: query.getAll("status").filter(isAnimalStatus),
    species: query.getAll("species").filter(isAnimalSpecies),
    hostFamilyId: query.get("hostFamilyId"),
  };

  return animalSearch;
}

const TITLE = "Animaux";

const SearchAnimalPage: PageComponent = () => {
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });

  usePageScrollRestoration();

  const { search, rawSearch, setRawSearch, filters, setFilters } =
    useSearchAndFilters(() => createAnimalSearchFromQuery());

  useEffect(() => {
    const query = createQueryFromAnimalSearch({ search, ...filters });
    if (!isEqual(query, routerRef.current.query)) {
      routerRef.current.replace(query);
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
    renderItem: (animal) => <SearchableAnimalLinkItem animal={animal} />,
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

  const searchInputElement = useRef<HTMLInputElement>(null!);
  const { screenSize } = useScreenSize();

  return (
    <ApplicationLayout>
      <PageTitle title="Chercher un animal" />
      <Header>
        <HeaderBackLink href=".." />

        <SearchInput
          size={screenSize <= ScreenSize.SMALL ? "small" : "medium"}
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
