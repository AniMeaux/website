import { Form, useSubmit } from "@remix-run/react";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filter, Filters } from "~/core/controllers/filters";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { ControlledInput } from "~/core/formElements/controlledInput";
import {
  Suggestion,
  SuggestionInput,
  SuggestionLabel,
  Suggestions,
} from "~/core/formElements/filterSuggestions";
import { useOptimisticSearchParams } from "~/core/searchParams";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";
import { Icon } from "~/generated/icon";

export function FosterFamilyFilters({
  possibleCities,
}: {
  possibleCities: string[];
}) {
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const fosterFamilySearchParams = new FosterFamilySearchParams(searchParams);
  const visibleFilters = {
    cities: fosterFamilySearchParams.getCities(),
    displayName: fosterFamilySearchParams.getDisplayName(),
    sort: fosterFamilySearchParams.getSort(),
    speciesAlreadyPresent: fosterFamilySearchParams.getSpeciesAlreadyPresent(),
    speciesToAvoid: fosterFamilySearchParams.getSpeciesToAvoid(),
    speciesToHost: fosterFamilySearchParams.getSpeciesToHost(),
    zipCode: fosterFamilySearchParams.getZipCode(),
  };

  return (
    <Form
      method="get"
      onChange={(event) => submit(event.currentTarget)}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <BaseLink
          to={{ search: "" }}
          className={actionClassName.standalone({
            variant: "secondary",
            color: "gray",
          })}
        >
          Tout effacer
        </BaseLink>
      </div>

      <Filters>
        <Filter
          value={FosterFamilySearchParams.Keys.SORT}
          label="Trier"
          count={
            visibleFilters.sort === FosterFamilySearchParams.Sort.RELEVANCE
              ? 0
              : 1
          }
          hiddenContent={
            <input
              type="hidden"
              name={FosterFamilySearchParams.Keys.SORT}
              value={visibleFilters.sort}
            />
          }
        >
          <Suggestions>
            <Suggestion>
              <SuggestionInput
                type="radio"
                name={FosterFamilySearchParams.Keys.SORT}
                value={FosterFamilySearchParams.Sort.RELEVANCE}
                checked={
                  visibleFilters.sort ===
                  FosterFamilySearchParams.Sort.RELEVANCE
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="bolt" />}>
                Pertinence
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={FosterFamilySearchParams.Keys.SORT}
                value={FosterFamilySearchParams.Sort.NAME}
                checked={
                  visibleFilters.sort === FosterFamilySearchParams.Sort.NAME
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="arrowDownAZ" />}>
                Alphabétique
              </SuggestionLabel>
            </Suggestion>
          </Suggestions>
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.DISPLAY_NAME}
          label="Nom"
          count={visibleFilters.displayName == null ? 0 : 1}
          hiddenContent={
            <input
              type="hidden"
              name={FosterFamilySearchParams.Keys.DISPLAY_NAME}
              value={visibleFilters.displayName ?? ""}
            />
          }
        >
          <ControlledInput
            name={FosterFamilySearchParams.Keys.DISPLAY_NAME}
            value={visibleFilters.displayName ?? ""}
            rightAdornment={
              visibleFilters.displayName != null ? (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(
                      fosterFamilySearchParams.deleteDisplayName()
                    )
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              ) : null
            }
          />
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.SPECIES_TO_HOST}
          label="Espèce à accueillir"
          count={visibleFilters.speciesToHost == null ? 0 : 1}
          hiddenContent={
            visibleFilters.speciesToHost != null ? (
              <input
                type="hidden"
                name={FosterFamilySearchParams.Keys.SPECIES_TO_HOST}
                value={visibleFilters.speciesToHost}
              />
            ) : null
          }
        >
          <Suggestions>
            {SORTED_SPECIES.map((species) => (
              <Suggestion key={species}>
                <SuggestionInput
                  type="radio"
                  name={FosterFamilySearchParams.Keys.SPECIES_TO_HOST}
                  value={species}
                  checked={visibleFilters.speciesToHost === species}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id={SPECIES_ICON[species]} />}>
                  {SPECIES_TRANSLATION[species]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.SPECIES_ALREADY_PRESENT}
          label="Espèces déjà présentes"
          count={visibleFilters.speciesAlreadyPresent.length}
          hiddenContent={visibleFilters.speciesAlreadyPresent.map((species) => (
            <input
              key={species}
              type="hidden"
              name={FosterFamilySearchParams.Keys.SPECIES_ALREADY_PRESENT}
              value={species}
            />
          ))}
        >
          <Suggestions>
            {SORTED_SPECIES.map((species) => (
              <Suggestion key={species}>
                <SuggestionInput
                  type="checkbox"
                  name={FosterFamilySearchParams.Keys.SPECIES_ALREADY_PRESENT}
                  value={species}
                  checked={visibleFilters.speciesAlreadyPresent.includes(
                    species
                  )}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id={SPECIES_ICON[species]} />}>
                  {SPECIES_TRANSLATION[species]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.SPECIES_TO_AVOID}
          label="Espèces à éviter"
          count={visibleFilters.speciesToAvoid.length}
          hiddenContent={visibleFilters.speciesToAvoid.map((species) => (
            <input
              key={species}
              type="hidden"
              name={FosterFamilySearchParams.Keys.SPECIES_TO_AVOID}
              value={species}
            />
          ))}
        >
          <Suggestions>
            {SORTED_SPECIES.map((species) => (
              <Suggestion key={species}>
                <SuggestionInput
                  type="checkbox"
                  name={FosterFamilySearchParams.Keys.SPECIES_TO_AVOID}
                  value={species}
                  checked={visibleFilters.speciesToAvoid.includes(species)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id={SPECIES_ICON[species]} />}>
                  {SPECIES_TRANSLATION[species]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.ZIP_CODE}
          label="Département ou code postal"
          count={visibleFilters.zipCode == null ? 0 : 1}
          hiddenContent={
            <input
              type="hidden"
              name={FosterFamilySearchParams.Keys.ZIP_CODE}
              value={visibleFilters.zipCode ?? ""}
            />
          }
        >
          <ControlledInput
            name={FosterFamilySearchParams.Keys.ZIP_CODE}
            value={visibleFilters.zipCode ?? ""}
            inputMode="numeric"
            pattern="\d+"
            leftAdornment={
              <Adornment>
                <Icon id="locationDot" />
              </Adornment>
            }
            rightAdornment={
              visibleFilters.zipCode != null ? (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(fosterFamilySearchParams.deleteZipCode())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              ) : null
            }
          />
        </Filter>

        <Filter
          value={FosterFamilySearchParams.Keys.CITY}
          label="Ville"
          count={visibleFilters.cities.length}
          hiddenContent={visibleFilters.cities.map((city) => (
            <input
              key={city}
              type="hidden"
              name={FosterFamilySearchParams.Keys.CITY}
              value={city}
            />
          ))}
        >
          <Suggestions>
            {possibleCities.map((city) => (
              <Suggestion key={city}>
                <SuggestionInput
                  type="checkbox"
                  name={FosterFamilySearchParams.Keys.CITY}
                  value={city}
                  checked={visibleFilters.cities.includes(city)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id="locationDot" />}>
                  {city}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>
      </Filters>
    </Form>
  );
}
