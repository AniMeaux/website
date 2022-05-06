import { AnimalSpecies } from "@animeaux/shared";
import { ElementType } from "react";
import { IconBaseProps } from "react-icons";
import { BirdIcon } from "~/icons/birdIcon";
import { CatIcon } from "~/icons/catIcon";
import { DogIcon } from "~/icons/dogIcon";
import { ReptileIcon } from "~/icons/reptileIcon";
import { RodentIcon } from "~/icons/rodentIcon";

const AnimalSpeciesIcons: Record<AnimalSpecies, ElementType> = {
  [AnimalSpecies.BIRD]: BirdIcon,
  [AnimalSpecies.CAT]: CatIcon,
  [AnimalSpecies.DOG]: DogIcon,
  [AnimalSpecies.REPTILE]: ReptileIcon,
  [AnimalSpecies.RODENT]: RodentIcon,
};

export type AnimalSpeciesIconProps = IconBaseProps & {
  species: AnimalSpecies;
};

export function AnimalSpeciesIcon({
  species,
  ...rest
}: AnimalSpeciesIconProps) {
  const Icon = AnimalSpeciesIcons[species];
  return <Icon {...rest} />;
}
