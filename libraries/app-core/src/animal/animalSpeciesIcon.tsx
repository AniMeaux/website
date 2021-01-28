import { AnimalSpecies } from "@animeaux/shared-entities";
import {
  BirdIcon,
  CatIcon,
  DogIcon,
  ReptileIcon,
  RodentIcon,
} from "@animeaux/ui-library";
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
