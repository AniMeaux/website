import { AnimalGender } from "@animeaux/shared-entities/build/animal";
import { ElementType } from "react";
import { IconBaseProps } from "react-icons";
import { FaMars, FaVenus } from "react-icons/fa";

const AnimalGenderIcons: Record<AnimalGender, ElementType> = {
  [AnimalGender.FEMALE]: FaVenus,
  [AnimalGender.MALE]: FaMars,
};

export type AnimalGenderIconProps = IconBaseProps & {
  gender: AnimalGender;
};

export function AnimalGenderIcon({ gender, ...rest }: AnimalGenderIconProps) {
  const Icon = AnimalGenderIcons[gender];
  return <Icon {...rest} />;
}
