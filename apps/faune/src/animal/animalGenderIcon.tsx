import { AnimalGender } from "@animeaux/shared";
import { IconBaseProps } from "react-icons";
import { FaMars, FaVenus } from "react-icons/fa";

type AnimalGenderIconProps = IconBaseProps & {
  gender: AnimalGender;
};

const AnimalGenderIcons: Record<AnimalGender, React.VFC<IconBaseProps>> = {
  [AnimalGender.FEMALE]: FaVenus,
  [AnimalGender.MALE]: FaMars,
};

export function AnimalGenderIcon({ gender, ...rest }: AnimalGenderIconProps) {
  const Icon = AnimalGenderIcons[gender];
  return <Icon {...rest} />;
}
