import {
  AnimalAge,
  AnimalSpecies,
  ANIMAL_AGE_RANGE_BY_SPECIES,
} from "@animeaux/shared";
import cn from "classnames";
import { AdoptSearchParams } from "core/adoptSearchParams";
import { ANIMAL_AGES_LABELS, ANIMAL_SPECIES_LABELS } from "core/labels";
import { Link } from "core/link";
import { ChildrenProp } from "core/types";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./searchForm.module.css";

type OptionAll = "ALL";
type AnimalSpeciesOption = OptionAll | AnimalSpecies;
type AnimalAgeOption = OptionAll | AnimalAge;

export const ANIMAL_AGES_BY_SPECIES: Record<AnimalSpecies, AnimalAge[]> = {
  [AnimalSpecies.BIRD]: getAnimalAgesForSpecies(AnimalSpecies.BIRD),
  [AnimalSpecies.CAT]: getAnimalAgesForSpecies(AnimalSpecies.CAT),
  [AnimalSpecies.DOG]: getAnimalAgesForSpecies(AnimalSpecies.DOG),
  [AnimalSpecies.REPTILE]: getAnimalAgesForSpecies(AnimalSpecies.REPTILE),
  [AnimalSpecies.RODENT]: getAnimalAgesForSpecies(AnimalSpecies.RODENT),
};

export type SearchFormProps = {
  searchParams?: AdoptSearchParams;
  hasAll?: boolean;
};

export function SearchForm({ hasAll = false, searchParams }: SearchFormProps) {
  const [params, setParams] = useState(
    () => searchParams ?? new AdoptSearchParams()
  );

  useEffect(() => {
    if (searchParams != null) {
      setParams(searchParams);
    }
  }, [searchParams]);

  const agesOptions =
    params.animalSpecies == null
      ? []
      : ANIMAL_AGES_BY_SPECIES[params.animalSpecies];

  const defaultValue: OptionAll | null = hasAll ? "ALL" : null;

  return (
    <div className={styles.form}>
      <Select<AnimalSpeciesOption>
        placeholder="Espèce"
        value={params.animalSpecies ?? defaultValue}
        onChange={(value) =>
          setParams((params) =>
            params.withSpecies(value === "ALL" ? null : value).withAge(null)
          )
        }
      >
        {hasAll && <option value="ALL">Toutes les espèces</option>}

        {Object.values(AnimalSpecies).map((species) => (
          <option key={species} value={species}>
            {ANIMAL_SPECIES_LABELS[species]}
          </option>
        ))}
      </Select>

      {agesOptions.length > 0 && (
        <Select<AnimalAgeOption>
          placeholder="Âge"
          value={params.animalAge ?? defaultValue}
          onChange={(value) =>
            setParams((params) =>
              params.withAge(value === "ALL" ? null : value)
            )
          }
        >
          {hasAll && <option value="ALL">Tout âge</option>}

          {agesOptions.map((age) => (
            <option key={age} value={age}>
              {ANIMAL_AGES_LABELS[age]}
            </option>
          ))}
        </Select>
      )}

      <Link href={params.toUrl()} className={styles.link}>
        <FaSearch />
        <span className={styles.linkLabel}>Chercher</span>
      </Link>
    </div>
  );
}

type SelectProps<ValueType> = ChildrenProp & {
  value: ValueType | null;
  onChange: (value: ValueType) => void;
  placeholder: string;
};

function Select<ValueType extends string>({
  placeholder,
  value,
  onChange,
  children,
}: SelectProps<ValueType>) {
  return (
    <select
      value={value == null ? "" : String(value)}
      onChange={(event) => {
        onChange(event.target.value as ValueType);
      }}
      className={cn(styles.select, { [styles.empty]: value == null })}
    >
      <option disabled value="">
        {placeholder}
      </option>

      {children}
    </select>
  );
}

function getAnimalAgesForSpecies(animalSpecies: AnimalSpecies): AnimalAge[] {
  const agesRanges = ANIMAL_AGE_RANGE_BY_SPECIES[animalSpecies];
  if (agesRanges == null) {
    return [];
  }

  return Object.values(AnimalAge).filter((age) => agesRanges[age] != null);
}
