import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { Form } from "#core/form-elements/form";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import {
  GARDEN_TRANSLATION,
  HOUSING_TRANSLATION,
  ICON_BY_GARDEN,
  ICON_BY_HOUSING,
  SORTED_GARDEN,
  SORTED_HOUSING,
} from "#foster-families/housing";
import { FosterFamilySearchParams } from "#foster-families/search-params";
import { Icon } from "#generated/icon";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

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
                      return FosterFamilySearchParams.set(
                        searchParams,
                        (fosterFamilySearchParams) => ({
                          ...fosterFamilySearchParams,
                          displayName: undefined,
                        }),
                      );
                    })
                  }
                >
                  <Icon href="icon-x-mark" />
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
                icon={<Icon href={SPECIES_ICON[species]} />}
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
                icon={<Icon href={SPECIES_ICON[species]} />}
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
                icon={<Icon href={SPECIES_ICON[species]} />}
                checked={fosterFamilySearchParams.speciesToAvoid.has(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <HousingFilter />

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
                <Icon href="icon-location-dot" />
              </ControlledInput.Adornment>
            }
            rightAdornment={
              fosterFamilySearchParams.zipCode != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) => {
                      return FosterFamilySearchParams.set(
                        searchParams,
                        (fosterFamilySearchParams) => ({
                          ...fosterFamilySearchParams,
                          zipCode: undefined,
                        }),
                      );
                    })
                  }
                >
                  <Icon href="icon-x-mark" />
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
                icon={<Icon href="icon-location-dot" />}
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

function HousingFilter() {
  const [searchParams] = useOptimisticSearchParams();
  const fosterFamilySearchParams = FosterFamilySearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={FosterFamilySearchParams.keys.housing}
      label="Logement"
      count={
        fosterFamilySearchParams.housing.size +
        fosterFamilySearchParams.garden.size
      }
      hiddenContent={
        <>
          {Array.from(fosterFamilySearchParams.housing).map((housing) => (
            <input
              key={housing}
              type="hidden"
              name={FosterFamilySearchParams.keys.housing}
              value={housing}
            />
          ))}

          {Array.from(fosterFamilySearchParams.garden).map((garden) => (
            <input
              key={garden}
              type="hidden"
              name={FosterFamilySearchParams.keys.garden}
              value={garden}
            />
          ))}
        </>
      }
    >
      <Form.Fields>
        <Form.Field>
          <Form.Label asChild>
            <span>Type de logement</span>
          </Form.Label>

          <ToggleInputList>
            {SORTED_HOUSING.map((housing) => (
              <ToggleInput
                key={housing}
                type="checkbox"
                label={HOUSING_TRANSLATION[housing]}
                name={FosterFamilySearchParams.keys.housing}
                value={housing}
                icon={ICON_BY_HOUSING[housing]}
                checked={fosterFamilySearchParams.housing.has(housing)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label asChild>
            <span>Jardin</span>
          </Form.Label>

          <ToggleInputList>
            {SORTED_GARDEN.map((garden) => (
              <ToggleInput
                key={garden}
                type="checkbox"
                label={GARDEN_TRANSLATION[garden]}
                name={FosterFamilySearchParams.keys.garden}
                value={garden}
                icon={ICON_BY_GARDEN[garden]}
                checked={fosterFamilySearchParams.garden.has(garden)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>
      </Form.Fields>
    </Filters.Filter>
  );
}
