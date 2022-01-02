import { AnimalGender } from "@animeaux/shared-entities/build/animal";
import { ElementType } from "react";
import { IconBaseProps } from "react-icons";
import { FaMars, FaVenus } from "react-icons/fa";
import styled from "styled-components";

const AnimalGenderIcons: Record<AnimalGender, ElementType> = {
  [AnimalGender.FEMALE]: FaVenus,
  [AnimalGender.MALE]: FaMars,
};

export type AnimalGenderIconProps = IconBaseProps & {
  gender: AnimalGender;
};

export function AnimalGenderIcon({ gender, ...rest }: AnimalGenderIconProps) {
  return <Icon {...rest} $gender={gender} as={AnimalGenderIcons[gender]} />;
}

const Icon = styled.span<{ $gender: AnimalGender }>`
  color: ${(props) =>
    props.$gender === AnimalGender.MALE ? "var(--blue-medium)" : "#ed265c"};
`;
