import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import {
  BREED_DEFAULT_SORT,
  BreedSearchParams,
  BreedSort,
} from "~/breeds/searchParams";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filters } from "~/core/controllers/filters";
import { ControlledInput } from "~/core/formElements/controlledInput";
import { ToggleInput, ToggleInputList } from "~/core/formElements/toggleInput";
import { useOptimisticSearchParams } from "~/core/searchParams";
import { Icon } from "~/generated/icon";

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
              icon={<Icon id="arrowDownAZ" />}
              checked={breedSearchParams.sort === BreedSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Nombre d’animaux"
              name={BreedSearchParams.keys.sort}
              value={BreedSort.ANIMAL_COUNT}
              icon={<Icon id="arrowDown91" />}
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
            )
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
                icon={<Icon id={SPECIES_ICON[species]} />}
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
                      const copy = new URLSearchParams(searchParams);
                      BreedSearchParams.set(copy, { name: undefined });
                      return copy;
                    });
                  }}
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
