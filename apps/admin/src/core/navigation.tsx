import {
  Navigation as BaseNavigation,
  NavItem,
  NavLink,
  ScreenSize,
  useScreenSize,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna, FaUser } from "react-icons/fa";

type NavigationProps = {
  hideOnSmallScreen?: boolean;
};

export function Navigation({ hideOnSmallScreen = false }: NavigationProps) {
  const { screenSize } = useScreenSize();

  if (hideOnSmallScreen && screenSize === ScreenSize.SMALL) {
    return null;
  }

  return (
    <BaseNavigation>
      <NavItem>
        <NavLink label="Utilisateurs" href="/users" icon={<FaUser />} />
      </NavItem>

      <NavItem>
        <NavLink label="Races" href="/animal-breeds" icon={<FaDna />} />
      </NavItem>
    </BaseNavigation>
  );
}
