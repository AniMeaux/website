import {
  Navigation as BaseNavigation,
  NavItem,
  NavLink,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaHome, FaPaw } from "react-icons/fa";

export function Navigation() {
  return (
    <BaseNavigation>
      <NavItem>
        <NavLink label="Animaux" href="/animals" icon={<FaPaw />} />
      </NavItem>

      <NavItem>
        <NavLink label="FA" href="/host-families" icon={<FaHome />} />
      </NavItem>
    </BaseNavigation>
  );
}
