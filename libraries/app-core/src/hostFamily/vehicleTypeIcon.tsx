import { Trilean } from "@animeaux/shared-entities";
import * as React from "react";
import { IconBaseProps } from "react-icons";
import { FaCar, FaQuestion, FaWalking } from "react-icons/fa";

const VehicleTypeIcons: { [key in Trilean]: React.ElementType } = {
  [Trilean.UNKNOWN]: FaQuestion,
  [Trilean.TRUE]: FaCar,
  [Trilean.FALSE]: FaWalking,
};

type VehicleTypeIconProps = IconBaseProps & {
  hasVehicle: Trilean;
};

export function VehicleTypeIcon({ hasVehicle, ...rest }: VehicleTypeIconProps) {
  const Icon = VehicleTypeIcons[hasVehicle];
  return <Icon {...rest} />;
}
