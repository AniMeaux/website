import {
  Navigation as BaseNavigation,
  NavItem,
  NavLink,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna, FaUser } from "react-icons/fa";

export function Navigation() {
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
