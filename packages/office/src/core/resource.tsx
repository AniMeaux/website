import { ResourceKey } from "@animeaux/shared";
import * as React from "react";
import {
  FaDna,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import Logo from "../ui/logo.svg";

const ResourceIcons: { [key in ResourceKey]: React.ElementType } = {
  animal: Logo,
  animal_breed: FaDna,
  blog: FaFileAlt,
  host_family: FaHome,
  partner: FaHandshake,
  user: FaUser,
  user_role: FaShieldAlt,
};

type ResourceIconProps = React.SVGAttributes<HTMLOrSVGElement> & {
  resourceKey: ResourceKey;
};

export function ResourceIcon({ resourceKey, ...rest }: ResourceIconProps) {
  const Icon = ResourceIcons[resourceKey];
  return <Icon {...rest} />;
}
