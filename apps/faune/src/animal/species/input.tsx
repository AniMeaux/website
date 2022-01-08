import { AnimalSpecies } from "@animeaux/shared";
import { AnimalSpeciesIcon } from "animal/species/icon";
import { ANIMAL_SPECIES_LABELS } from "animal/species/labels";
import {
  Selector,
  SelectorCheckbox,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";
import { SetStateAction } from "core/types";

type AnimalSpeciesInputProps = {
  value?: AnimalSpecies | null;
  onChange: React.Dispatch<AnimalSpecies>;
  hasError?: boolean;
};

export function AnimalSpeciesInput({
  value,
  onChange,
  hasError = false,
}: AnimalSpeciesInputProps) {
  return (
    <Selectors>
      {Object.values(AnimalSpecies).map((species) => (
        <SelectorItem key={species}>
          <Selector hasError={hasError}>
            <SelectorRadio
              name="species"
              checked={value === species}
              onChange={() => onChange(species)}
            />

            <SelectorIcon>
              <AnimalSpeciesIcon species={species} />
            </SelectorIcon>

            <SelectorLabel>{ANIMAL_SPECIES_LABELS[species]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}

type AnimalMultipleSpeciesInputProps = {
  value?: AnimalSpecies[] | null;
  onChange: React.Dispatch<SetStateAction<AnimalSpecies[]>>;
};

export function AnimalMultipleSpeciesInput({
  value: valueProp,
  onChange,
}: AnimalMultipleSpeciesInputProps) {
  // Default parameter value isn't used for `null`.
  const value = valueProp ?? [];

  return (
    <Selectors>
      {Object.values(AnimalSpecies).map((species) => (
        <SelectorItem key={species}>
          <Selector>
            <SelectorCheckbox
              name={`species-${species}`}
              checked={value.includes(species)}
              onChange={() =>
                onChange((selectedSpecies) =>
                  selectedSpecies.includes(species)
                    ? value.filter((v) => v !== species)
                    : value.concat([species])
                )
              }
            />

            <SelectorIcon>
              <AnimalSpeciesIcon species={species} />
            </SelectorIcon>

            <SelectorLabel>{ANIMAL_SPECIES_LABELS[species]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
