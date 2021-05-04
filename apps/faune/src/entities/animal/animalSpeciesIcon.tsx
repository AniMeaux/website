import { AnimalSpecies } from "@animeaux/shared-entities";
import * as React from "react";
import { IconBaseProps } from "react-icons";
import { BirdIcon } from "ui/icons/birdIcon";
import { CatIcon } from "ui/icons/catIcon";
import { DogIcon } from "ui/icons/dogIcon";
import { ReptileIcon } from "ui/icons/reptileIcon";
import { RodentIcon } from "ui/icons/rodentIcon";

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
