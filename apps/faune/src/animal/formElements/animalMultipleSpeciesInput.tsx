import {
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { AnimalSpeciesIcon } from "animal/animalSpeciesIcon";
import {
  Selector,
  SelectorCheckbox,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  Selectors,
} from "core/formElements/selector";

type AnimalMultipleSpeciesInputProps = {
  value?: AnimalSpecies[] | null;
  onChange: React.Dispatch<React.SetStateAction<AnimalSpecies[]>>;
};

export function AnimalMultipleSpeciesInput({
  value: valueProp,
  onChange,
}: AnimalMultipleSpeciesInputProps) {
  // Default parameter value isn't used for `null`.
  const value = valueProp ?? [];

  return (
    <Selectors>
      {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
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

            <SelectorLabel>{AnimalSpeciesLabels[species]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
