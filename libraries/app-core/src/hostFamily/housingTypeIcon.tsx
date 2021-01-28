import { HousingType } from "@animeaux/shared-entities";
import * as React from "react";
import { IconBaseProps } from "react-icons";
import { FaBuilding, FaHome } from "react-icons/fa";

const HousingTypeIcons: { [key in HousingType]: React.ElementType } = {
  [HousingType.APARTMENT]: FaBuilding,
  [HousingType.HOUSE]: FaHome,
};

type HousingTypeIconIconProps = IconBaseProps & {
  housingType: HousingType;
};

export function HousingTypeIcon({
  housingType,
  ...rest
}: HousingTypeIconIconProps) {
  const Icon = HousingTypeIcons[housingType];
  return <Icon {...rest} />;
}
