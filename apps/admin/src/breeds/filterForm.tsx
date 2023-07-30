import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import { BreedSearchParams } from "~/breeds/searchParams";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filters } from "~/core/controllers/filters";
import { ControlledInput } from "~/core/formElements/controlledInput";
import { ToggleInput, ToggleInputList } from "~/core/formElements/toggleInput";
import { useOptimisticSearchParams } from "~/core/searchParams";
import { Icon } from "~/generated/icon";

export function BreedFilterForm() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const breedSearchParams = new BreedSearchParams(searchParams);
  const visibleFilters = {
    name: breedSearchParams.getName(),
    species: breedSearchParams.getSpecies(),
    sort: breedSearchParams.getSort(),
  };

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
          value={BreedSearchParams.Keys.SORT}
          label="Trier"
          count={visibleFilters.sort === BreedSearchParams.Sort.NAME ? 0 : 1}
          hiddenContent={
            visibleFilters.sort !== BreedSearchParams.Sort.NAME ? (
              <input
                type="hidden"
                name={BreedSearchParams.Keys.SORT}
                value={visibleFilters.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={BreedSearchParams.Keys.SORT}
              value={BreedSearchParams.Sort.NAME}
              icon={<Icon id="arrowDownAZ" />}
              checked={visibleFilters.sort === BreedSearchParams.Sort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Nombre d’animaux"
              name={BreedSearchParams.Keys.SORT}
              value={BreedSearchParams.Sort.ANIMAL_COUNT}
              icon={<Icon id="arrowDown91" />}
              checked={
                visibleFilters.sort === BreedSearchParams.Sort.ANIMAL_COUNT
              }
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={BreedSearchParams.Keys.SPECIES}
          label="Espèces"
          count={visibleFilters.species.length}
          hiddenContent={visibleFilters.species.map((species) => (
            <input
              key={species}
              type="hidden"
              name={BreedSearchParams.Keys.SPECIES}
              value={species}
            />
          ))}
        >
          <ToggleInputList>
            {SORTED_SPECIES.map((species) => (
              <ToggleInput
                key={species}
                type="checkbox"
                label={SPECIES_TRANSLATION[species]}
                name={BreedSearchParams.Keys.SPECIES}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={visibleFilters.species.includes(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={BreedSearchParams.Keys.NAME}
          label="Nom"
          count={visibleFilters.name == null ? 0 : 1}
          hiddenContent={
            visibleFilters.name != null ? (
              <input
                type="hidden"
                name={BreedSearchParams.Keys.NAME}
                value={visibleFilters.name}
              />
            ) : null
          }
        >
          <ControlledInput
            name={BreedSearchParams.Keys.NAME}
            value={visibleFilters.name ?? ""}
            rightAdornment={
              visibleFilters.name != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) =>
                      new BreedSearchParams(searchParams).deleteName()
                    )
                  }
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
