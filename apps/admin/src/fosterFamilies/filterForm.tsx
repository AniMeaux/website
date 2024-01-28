import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species";
import { Action } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { Filters } from "#core/controllers/filters";
import { ControlledInput } from "#core/formElements/controlledInput";
import { ToggleInput, ToggleInputList } from "#core/formElements/toggleInput";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams";
import { Icon } from "#generated/icon";
import { useOptimisticSearchParams } from "@animeaux/form-data";

export function FosterFamilyFilters({
  possibleCities,
}: {
  possibleCities: string[];
}) {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const fosterFamilySearchParams = FosterFamilySearchParams.parse(searchParams);

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
          value={FosterFamilySearchParams.keys.displayName}
          label="Nom"
          count={fosterFamilySearchParams.displayName == null ? 0 : 1}
          hiddenContent={
            fosterFamilySearchParams.displayName != null ? (
              <input
                type="hidden"
                name={FosterFamilySearchParams.keys.displayName}
                value={fosterFamilySearchParams.displayName}
              />
            ) : null
          }
        >
          <ControlledInput
            name={FosterFamilySearchParams.keys.displayName}
            value={fosterFamilySearchParams.displayName ?? ""}
            rightAdornment={
              fosterFamilySearchParams.displayName != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) => {
                      const copy = new URLSearchParams(searchParams);
                      FosterFamilySearchParams.set(copy, {
                        displayName: undefined,
                      });
                      return copy;
                    })
                  }
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>

        <Filters.Filter
          value={FosterFamilySearchParams.keys.speciesToHost}
          label="Espèce à accueillir"
          count={fosterFamilySearchParams.speciesToHost == null ? 0 : 1}
          hiddenContent={
            fosterFamilySearchParams.speciesToHost != null ? (
              <input
                type="hidden"
                name={FosterFamilySearchParams.keys.speciesToHost}
                value={fosterFamilySearchParams.speciesToHost}
              />
            ) : null
          }
        >
          <ToggleInputList>
            {SORTED_SPECIES.map((species) => (
              <ToggleInput
                key={species}
                type="radio"
                label={SPECIES_TRANSLATION[species]}
                name={FosterFamilySearchParams.keys.speciesToHost}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={fosterFamilySearchParams.speciesToHost === species}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={FosterFamilySearchParams.keys.speciesAlreadyPresent}
          label="Espèces déjà présentes"
          count={fosterFamilySearchParams.speciesAlreadyPresent.size}
          hiddenContent={Array.from(
            fosterFamilySearchParams.speciesAlreadyPresent,
          ).map((species) => (
            <input
              key={species}
              type="hidden"
              name={FosterFamilySearchParams.keys.speciesAlreadyPresent}
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
                name={FosterFamilySearchParams.keys.speciesAlreadyPresent}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={fosterFamilySearchParams.speciesAlreadyPresent.has(
                  species,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={FosterFamilySearchParams.keys.speciesToAvoid}
          label="Espèces à éviter"
          count={fosterFamilySearchParams.speciesToAvoid.size}
          hiddenContent={Array.from(
            fosterFamilySearchParams.speciesToAvoid,
          ).map((species) => (
            <input
              key={species}
              type="hidden"
              name={FosterFamilySearchParams.keys.speciesToAvoid}
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
                name={FosterFamilySearchParams.keys.speciesToAvoid}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={fosterFamilySearchParams.speciesToAvoid.has(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={FosterFamilySearchParams.keys.zipCode}
          label="Département ou code postal"
          count={fosterFamilySearchParams.zipCode == null ? 0 : 1}
          hiddenContent={
            fosterFamilySearchParams.zipCode != null ? (
              <input
                type="hidden"
                name={FosterFamilySearchParams.keys.zipCode}
                value={fosterFamilySearchParams.zipCode}
              />
            ) : null
          }
        >
          <ControlledInput
            name={FosterFamilySearchParams.keys.zipCode}
            value={fosterFamilySearchParams.zipCode ?? ""}
            inputMode="numeric"
            pattern="\d+"
            leftAdornment={
              <ControlledInput.Adornment>
                <Icon id="locationDot" />
              </ControlledInput.Adornment>
            }
            rightAdornment={
              fosterFamilySearchParams.zipCode != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) => {
                      const copy = new URLSearchParams(searchParams);
                      FosterFamilySearchParams.set(copy, {
                        zipCode: undefined,
                      });
                      return copy;
                    })
                  }
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>

        <Filters.Filter
          value={FosterFamilySearchParams.keys.cities}
          label="Ville"
          count={fosterFamilySearchParams.cities.size}
          hiddenContent={Array.from(fosterFamilySearchParams.cities).map(
            (city) => (
              <input
                key={city}
                type="hidden"
                name={FosterFamilySearchParams.keys.cities}
                value={city}
              />
            ),
          )}
        >
          <ToggleInputList>
            {possibleCities.map((city) => (
              <ToggleInput
                key={city}
                type="checkbox"
                label={city}
                name={FosterFamilySearchParams.keys.cities}
                value={city}
                icon={<Icon id="locationDot" />}
                checked={fosterFamilySearchParams.cities.has(city)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
