import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#i/animals/species";
import {
  BREED_DEFAULT_SORT,
  BreedSearchParams,
  BreedSort,
} from "#i/breeds/search-params";
import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Filters } from "#i/core/controllers/filters";
import { ControlledInput } from "#i/core/form-elements/controlled-input";
import {
  ToggleInput,
  ToggleInputList,
} from "#i/core/form-elements/toggle-input";
import { Icon } from "#i/generated/icon";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function BreedFilterForm() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const breedSearchParams = BreedSearchParams.parse(searchParams);

  return (
    <Filters>
      <Filters.Actions>
        <Action asChild variant="secondary" color="gray">
          <BaseLink replace to={{ search: "" }}>
            Tout effacer
          </BaseLink>
        </Action>
      </Filters.Actions>

      <Filters.Content>
        <Filters.Filter
          value={BreedSearchParams.keys.sort}
          label="Trier"
          count={breedSearchParams.sort === BREED_DEFAULT_SORT ? 0 : 1}
          hiddenContent={
            breedSearchParams.sort !== BREED_DEFAULT_SORT ? (
              <input
                type="hidden"
                name={BreedSearchParams.keys.sort}
                value={breedSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={BreedSearchParams.keys.sort}
              value={BreedSort.NAME}
              icon={<Icon href="icon-arrow-down-a-z-solid" />}
              checked={breedSearchParams.sort === BreedSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Nombre d’animaux"
              name={BreedSearchParams.keys.sort}
              value={BreedSort.ANIMAL_COUNT}
              icon={<Icon href="icon-arrow-down-9-1-solid" />}
              checked={breedSearchParams.sort === BreedSort.ANIMAL_COUNT}
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={BreedSearchParams.keys.species}
          label="Espèces"
          count={breedSearchParams.species.size}
          hiddenContent={Array.from(breedSearchParams.species).map(
            (species) => (
              <input
                key={species}
                type="hidden"
                name={BreedSearchParams.keys.species}
                value={species}
              />
            ),
          )}
        >
          <ToggleInputList>
            {SORTED_SPECIES.map((species) => (
              <ToggleInput
                key={species}
                type="checkbox"
                label={SPECIES_TRANSLATION[species]}
                name={BreedSearchParams.keys.species}
                value={species}
                icon={<Icon href={SPECIES_ICON[species]} />}
                checked={breedSearchParams.species.has(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={BreedSearchParams.keys.name}
          label="Nom"
          count={breedSearchParams.name == null ? 0 : 1}
          hiddenContent={
            breedSearchParams.name != null ? (
              <input
                type="hidden"
                name={BreedSearchParams.keys.name}
                value={breedSearchParams.name}
              />
            ) : null
          }
        >
          <ControlledInput
            name={BreedSearchParams.keys.name}
            value={breedSearchParams.name ?? ""}
            rightAdornment={
              breedSearchParams.name != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() => {
                    setSearchParams((searchParams) => {
                      return BreedSearchParams.set(
                        searchParams,
                        (breedSearchParams) => ({
                          ...breedSearchParams,
                          name: undefined,
                        }),
                      );
                    });
                  }}
                >
                  <Icon href="icon-x-mark-solid" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
