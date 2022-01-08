import { AnimalSpecies } from "@animeaux/shared";
import { BirdIcon } from "core/icons/birdIcon";
import { CatIcon } from "core/icons/catIcon";
import { DogIcon } from "core/icons/dogIcon";
import { ReptileIcon } from "core/icons/reptileIcon";
import { RodentIcon } from "core/icons/rodentIcon";
import { IconBaseProps } from "react-icons";

type AnimalSpeciesIconProps = IconBaseProps & {
  species: AnimalSpecies;
};

const ANIMAL_SPECIES_ICONS: Record<AnimalSpecies, React.ElementType> = {
  [AnimalSpecies.BIRD]: BirdIcon,
  [AnimalSpecies.CAT]: CatIcon,
  [AnimalSpecies.DOG]: DogIcon,
  [AnimalSpecies.REPTILE]: ReptileIcon,
  [AnimalSpecies.RODENT]: RodentIcon,
};

export function AnimalSpeciesIcon({
  species,
  ...rest
}: AnimalSpeciesIconProps) {
  const Icon = ANIMAL_SPECIES_ICONS[species];
  return <Icon {...rest} />;
}
