import {
  AnimalAge,
  AnimalAgesBySpecies,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities/build/animal";
import cn from "classnames";
import { AdoptSearchParams } from "core/adoptSearchParams";
import { Link } from "core/link";
import { ChildrenProp } from "core/types";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./searchForm.module.css";

type OptionAll = "ALL";
type AnimalSpeciesOption = OptionAll | AnimalSpecies;
type AnimalAgeOption = OptionAll | AnimalAge;

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
      : AnimalAgesBySpecies[params.animalSpecies];

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

        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
          <option key={species} value={species}>
            {AnimalSpeciesLabels[species]}
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
              {AnimalAgesLabels[age]}
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
