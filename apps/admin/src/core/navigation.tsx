import {
  Navigation as BaseNavigation,
  NavigationItemList,
  NavigationProps as BaseNavigationProps,
  NavItem,
  NavLink,
  NavLinkContent,
  NavLinkIcon,
  NavLinkMainText,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna, FaPalette, FaUser } from "react-icons/fa";

type NavigationProps = Pick<BaseNavigationProps, "onlyLargeEnough">;

export function Navigation(props: NavigationProps) {
  return (
    <BaseNavigation {...props}>
      <NavigationItemList>
        <NavItem>
          <NavLink href="/users">
            <NavLinkIcon>
              <FaUser />
            </NavLinkIcon>

            <NavLinkContent>
              <NavLinkMainText>Utilisateurs</NavLinkMainText>
            </NavLinkContent>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/animal-breeds">
            <NavLinkIcon>
              <FaDna />
            </NavLinkIcon>

            <NavLinkContent>
              <NavLinkMainText>Races</NavLinkMainText>
            </NavLinkContent>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/animal-colors">
            <NavLinkIcon>
              <FaPalette />
            </NavLinkIcon>

            <NavLinkContent>
              <NavLinkMainText>Couleurs</NavLinkMainText>
            </NavLinkContent>
          </NavLink>
        </NavItem>
      </NavigationItemList>
    </BaseNavigation>
  );
}
