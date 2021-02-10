import {
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import {
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "@animeaux/ui-library";
import * as React from "react";
import { AnimalSpeciesIcon } from "./animal/animalSpeciesIcon";

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
