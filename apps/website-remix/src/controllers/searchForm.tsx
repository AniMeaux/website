import { AnimalAge, ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/shared";
import { Species } from "@prisma/client";
import orderBy from "lodash.orderby";
import { useCallback, useEffect, useState } from "react";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AGE_TRANSLATION, SPECIES_TRANSLATION } from "~/core/translations";
import { Icon } from "~/generated/icon";

const SORTED_SPECIES = orderBy(
  Object.values(Species),
  (species) => SPECIES_TRANSLATION[species]
);

const SORTED_AGES = orderBy(Object.values(AnimalAge), (age) =>
  age === AnimalAge.JUNIOR ? 0 : age === AnimalAge.ADULT ? 1 : 2
);

export const ANIMAL_AGES_BY_SPECIES: Record<Species, AnimalAge[]> = {
  [Species.BIRD]: getAnimalAgesForSpecies(Species.BIRD),
  [Species.CAT]: getAnimalAgesForSpecies(Species.CAT),
  [Species.DOG]: getAnimalAgesForSpecies(Species.DOG),
  [Species.REPTILE]: getAnimalAgesForSpecies(Species.REPTILE),
  [Species.RODENT]: getAnimalAgesForSpecies(Species.RODENT),
};

function getAnimalAgesForSpecies(species: Species): AnimalAge[] {
  const agesRanges = ANIMAL_AGE_RANGE_BY_SPECIES[species];
  if (agesRanges == null) {
    return [];
  }

  return SORTED_AGES.filter((age) => agesRanges[age] != null);
}

const AllOption = "ALL";
type AnimalSpeciesOption = typeof AllOption | Species;
type AnimalAgeOption = typeof AllOption | AnimalAge;

type SearchFormState = {
  species: AnimalSpeciesOption | null;
  age: AnimalAgeOption | null;
};

export function SearchForm({
  defaultSpecies,
  defaultAge,
  hasAllSpeciesByDefault = false,
  className,
}: {
  defaultSpecies?: Species;
  defaultAge?: AnimalAge;
  hasAllSpeciesByDefault?: boolean;
  className?: string;
}) {
  const setDefaults = useCallback(() => {
    let age: SearchFormState["age"] = defaultAge ?? null;
    if (defaultSpecies != null && defaultAge == null) {
      age = AllOption;
    }

    let species: SearchFormState["species"] = defaultSpecies ?? null;
    if (hasAllSpeciesByDefault && species == null) {
      species = AllOption;
    }

    return { species, age };
  }, [defaultSpecies, defaultAge, hasAllSpeciesByDefault]);

  const [state, setState] = useState<SearchFormState>(setDefaults);

  useEffect(() => {
    setState(setDefaults());
  }, [setDefaults]);

  const ageOptions =
    state.species == null || state.species === AllOption
      ? []
      : ANIMAL_AGES_BY_SPECIES[state.species];

  return (
    <div
      className={cn(
        className,
        "rounded-tl-2xl rounded-tr-xl rounded-br-2xl rounded-bl-xl bg-white shadow-base p-1 flex gap-2"
      )}
    >
      <Select<AnimalSpeciesOption>
        placeholder="Espèce"
        value={state.species}
        onChange={(species) => {
          let age: SearchFormState["age"] = null;
          if (
            species !== AllOption &&
            ANIMAL_AGES_BY_SPECIES[species].length > 0
          ) {
            age = AllOption;
          }

          return setState({ species, age });
        }}
      >
        <option value={AllOption}>Toutes les espèces</option>

        {SORTED_SPECIES.map((species) => (
          <option key={species} value={species}>
            {SPECIES_TRANSLATION[species]}
          </option>
        ))}
      </Select>

      {ageOptions.length > 0 && (
        <Select<AnimalAgeOption>
          placeholder="Âge"
          value={state.age}
          onChange={(age) => setState((prevState) => ({ ...prevState, age }))}
        >
          <option value={AllOption}>Tout âge</option>

          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {AGE_TRANSLATION[age]}
            </option>
          ))}
        </Select>
      )}

      <BaseLink
        to={getPath(state)}
        title="Rechercher"
        className="flex-none rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg flex p-3 bg-blue-base text-white transition-[background-color,transform] duration-100 ease-in-out hover:bg-blue-light active:scale-95"
      >
        <Icon id="magnifyingGlass" />
      </BaseLink>
    </div>
  );
}

function Select<ValueType extends string>({
  placeholder,
  value,
  onChange,
  children,
}: {
  value: ValueType | null;
  onChange: (value: ValueType) => void;
  placeholder: string;
  children?: React.ReactNode;
}) {
  return (
    <select
      value={value == null ? "" : String(value)}
      onChange={(event) => {
        onChange(event.target.value as ValueType);
      }}
      className={cn(
        "appearance-none min-w-0 flex-1 rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-transparent px-6 py-2 cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-50",
        { "text-gray-500": value == null }
      )}
    >
      <option disabled value="">
        {placeholder}
      </option>

      {children}
    </select>
  );
}

export const SPECIES_TO_PATH: Record<Species, string> = {
  [Species.BIRD]: "oiseau",
  [Species.CAT]: "chat",
  [Species.DOG]: "chien",
  [Species.REPTILE]: "reptile",
  [Species.RODENT]: "rongeur",
};

export const AGES_TO_PATH: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "junior",
  [AnimalAge.ADULT]: "adulte",
  [AnimalAge.SENIOR]: "senior",
};

function getPath(state: SearchFormState): string {
  let path = "/adoption";

  if (state.species != null && state.species !== AllOption) {
    path += `/${SPECIES_TO_PATH[state.species]}`;
  }

  if (state.age != null && state.age !== AllOption) {
    path += `/${AGES_TO_PATH[state.age]}`;
  }

  return path;
}
