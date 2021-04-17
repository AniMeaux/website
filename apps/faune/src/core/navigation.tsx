import {
  CurrentUserProfile,
  useCurrentUser,
  UserAvatar,
} from "@animeaux/app-core";
import { doesGroupsIntersect, UserGroup } from "@animeaux/shared-entities";
import {
  ButtonItem,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
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
import { FaHome, FaPaw } from "react-icons/fa";
import AppLogo from "./appLogo.svg";

type NavigationProps = Pick<BaseNavigationProps, "onlyLargeEnough">;

export function Navigation(props: NavigationProps) {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const [
    isCurrentUserProfileVisible,
    setIsCurrentUserProfileVisible,
  ] = React.useState(false);
  const currentUserButton = React.useRef<HTMLButtonElement>(null!);

  return (
    <BaseNavigation {...props}>
      <NavigationItemList className="NavigationLogo">
        <LinkItem href="/" className="NavigationLogo__item">
          <ItemIcon className="NavigationLogo__icon">
            <AppLogo />
          </ItemIcon>

          <NavLinkContent>
            <ItemMainText className="NavigationLogo__label">Faune</ItemMainText>
          </NavLinkContent>
        </LinkItem>
      </NavigationItemList>

      <NavigationItemList>
        <NavItem>
          <NavLink href="/animals">
            <NavLinkIcon>
              <FaPaw />
            </NavLinkIcon>

            <NavLinkContent>
              <NavLinkMainText>Animaux</NavLinkMainText>
            </NavLinkContent>
          </NavLink>
        </NavItem>

        {isCurrentUserAdmin && (
          <NavItem>
            <NavLink href="/host-families">
              <NavLinkIcon>
                <FaHome />
              </NavLinkIcon>

              <NavLinkContent>
                <NavLinkMainText>FA</NavLinkMainText>
              </NavLinkContent>
            </NavLink>
          </NavItem>
        )}
      </NavigationItemList>

      <NavigationItemList className="NavigationUserItem">
        <NavItem>
          <ButtonItem
            ref={currentUserButton}
            onClick={() => setIsCurrentUserProfileVisible(true)}
            className="NavigationUser"
          >
            <ItemIcon>
              <UserAvatar user={currentUser} />
            </ItemIcon>

            <NavLinkContent>
              <ItemMainText>{currentUser.displayName}</ItemMainText>
              <ItemSecondaryText>{currentUser.email}</ItemSecondaryText>
            </NavLinkContent>
          </ButtonItem>
        </NavItem>
      </NavigationItemList>

      <CurrentUserProfile
        open={isCurrentUserProfileVisible}
        onDismiss={() => setIsCurrentUserProfileVisible(false)}
        referenceElement={currentUserButton}
        placement="top-start"
      />
    </BaseNavigation>
  );
}
