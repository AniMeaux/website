import { AnimalAge, ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/shared";
import { Species } from "@prisma/client";
import orderBy from "lodash.orderby";
import { useState } from "react";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon } from "~/generated/icon";

const speciesTranslation: Record<Species, string> = {
  [Species.BIRD]: "Oiseau",
  [Species.CAT]: "Chat",
  [Species.DOG]: "Chien",
  [Species.REPTILE]: "Reptile",
  [Species.RODENT]: "Rongeur",
};

const ageTranslation: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};

const sortedSpecies = orderBy(
  Object.values(Species),
  (species) => speciesTranslation[species]
);

const sortedAges = orderBy(Object.values(AnimalAge), (age) =>
  age === AnimalAge.JUNIOR ? 0 : age === AnimalAge.ADULT ? 1 : 2
);

const animalAgesBySpecies: Record<Species, AnimalAge[]> = {
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

  return sortedAges.filter((age) => agesRanges[age] != null);
}

const AllOption = "ALL";
type AnimalSpeciesOption = typeof AllOption | Species;
type AnimalAgeOption = typeof AllOption | AnimalAge;

type State = {
  species: AnimalSpeciesOption | null;
  age: AnimalAgeOption | null;
};

export function SearchForm({
  hasAll = false,
  className,
}: {
  hasAll?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<State>({ species: null, age: null });

  const ageOptions =
    state.species == null || state.species === AllOption
      ? []
      : animalAgesBySpecies[state.species];

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
        onChange={(species) => setState({ species, age: null })}
      >
        {hasAll && <option value={AllOption}>Toutes les espèces</option>}

        {sortedSpecies.map((species) => (
          <option key={species} value={species}>
            {speciesTranslation[species]}
          </option>
        ))}
      </Select>

      {ageOptions.length > 0 && (
        <Select<AnimalAgeOption>
          placeholder="Âge"
          value={state.age}
          onChange={(age) => setState((prevState) => ({ ...prevState, age }))}
        >
          {hasAll && <option value={AllOption}>Tout âge</option>}

          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {ageTranslation[age]}
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
        "appearance-none min-w-0 flex-1 rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg px-6 py-2 cursor-pointer",
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

const speciesPath: Record<Species, string> = {
  [Species.BIRD]: "oiseau",
  [Species.CAT]: "chat",
  [Species.DOG]: "chien",
  [Species.REPTILE]: "reptile",
  [Species.RODENT]: "rongeur",
};

const agesPath: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "junior",
  [AnimalAge.ADULT]: "adulte",
  [AnimalAge.SENIOR]: "senior",
};

function getPath(state: State): string {
  let path = "/adoption";

  if (state.species != null && state.species !== AllOption) {
    path += `/${speciesPath[state.species]}`;
  }

  if (state.age != null && state.age !== AllOption) {
    path += `/${agesPath[state.age]}`;
  }

  return path;
}
