import { AnimalSpecies } from "@animeaux/shared-entities";
import { BirdIcon } from "icons/birdIcon";
import { CatIcon } from "icons/catIcon";
import { DogIcon } from "icons/dogIcon";
import { ReptileIcon } from "icons/reptileIcon";
import { RodentIcon } from "icons/rodentIcon";
import * as React from "react";
import { IconBaseProps } from "react-icons";

type AnimalSpeciesIconProps = IconBaseProps & {
  species: AnimalSpecies;
};

const AnimalSpeciesIcons: { [key in AnimalSpecies]: React.ElementType } = {
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
  const Icon = AnimalSpeciesIcons[species];
  return <Icon {...rest} />;
}
