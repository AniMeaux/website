import { AnimalGender } from "@animeaux/shared-entities";
import { IconBaseProps } from "react-icons";
import { FaMars, FaVenus } from "react-icons/fa";

type AnimalGenderIconProps = IconBaseProps & {
  gender: AnimalGender;
};

const AnimalGenderIcons: { [key in AnimalGender]: React.ElementType } = {
  [AnimalGender.FEMALE]: FaVenus,
  [AnimalGender.MALE]: FaMars,
};

export function AnimalGenderIcon({ gender, ...rest }: AnimalGenderIconProps) {
  const Icon = AnimalGenderIcons[gender];
  return <Icon {...rest} />;
}
