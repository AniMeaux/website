import {
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { AnimalSpeciesIcon } from "animal/animalSpeciesIcon";
import {
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";
import * as React from "react";

type AnimalSpeciesInputProps = {
  value?: AnimalSpecies | null;
  onChange: React.Dispatch<AnimalSpecies>;
};

export function AnimalSpeciesInput({
  value,
  onChange,
}: AnimalSpeciesInputProps) {
  return (
    <Selectors>
      {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((s) => (
        <SelectorItem key={s}>
          <Selector>
            <SelectorRadio
              name="species"
              checked={value === s}
              onChange={() => onChange(s)}
            />

            <SelectorIcon>
              <AnimalSpeciesIcon species={s} />
            </SelectorIcon>

            <SelectorLabel>{AnimalSpeciesLabels[s]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
