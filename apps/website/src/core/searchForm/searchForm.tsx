import {
  AnimalAge,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_AGES_ORDER,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities/build/animal";
import { Link } from "@animeaux/ui-library/build/core/link";
import { ChildrenProp } from "@animeaux/ui-library/build/core/types";
import cn from "classnames";
import * as React from "react";
import { FaSearch } from "react-icons/fa";

export function SearchForm() {
  const [
    animalSpecies,
    setAnimalSpecies,
  ] = React.useState<AnimalSpecies | null>(null);
  const [animalAge, setAnimalAge] = React.useState<AnimalAge | null>(null);

  const queries: string[] = [];
  if (animalSpecies != null) {
    queries.push(`species=${animalSpecies}`);
  }

  if (animalAge != null) {
    queries.push(`age=${animalAge}`);
  }

  let link = "/search";
  if (queries.length > 0) {
    link = `${link}?${queries.join("&")}`;
  }

  return (
    <div className="SearchForm">
      <Select
        placeholder="Espèce"
        value={animalSpecies}
        onChange={(value) => setAnimalSpecies(value)}
      >
        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
          <option key={species} value={species}>
            {AnimalSpeciesLabels[species]}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Âge"
        value={animalAge}
        onChange={(value) => setAnimalAge(value)}
      >
        {ANIMAL_AGES_ORDER.map((age) => (
          <option key={age} value={age}>
            {AnimalAgesLabels[age]}
          </option>
        ))}
      </Select>

      <Link href={link} className="SearchFormLink">
        <FaSearch />
        <span className="SearchFormLinkLabel">Chercher</span>
      </Link>
    </div>
  );
}

type SelectProps<ValueType> = ChildrenProp & {
  value?: ValueType | null;
  onChange?: (value: ValueType) => void;
  placeholder?: string;
};

function Select<ValueType = string>({
  placeholder = "",
  value,
  onChange,
  children,
}: SelectProps<ValueType>) {
  return (
    <select
      value={value == null ? "" : String(value)}
      onChange={(event) => {
        onChange?.((event.target.value as any) as ValueType);
      }}
      className={cn("SearchFormSelect", {
        "SearchFormSelect--empty": value == null,
      })}
    >
      <option disabled value="">
        {placeholder}
      </option>

      {children}
    </select>
  );
}
