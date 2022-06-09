import { CurrentUser, hasGroups, UserGroup } from "@animeaux/shared";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleRight,
  FaCalendarAlt,
  FaDna,
  FaEllipsisH,
  FaHome,
  FaPalette,
  FaPaw,
  FaUser,
} from "react-icons/fa";
import styled from "styled-components";
import {
  ButtonItem,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
} from "~/core/dataDisplay/item";
import { AppIcon } from "~/core/icons/appIcon";
import { useApplicationLayout } from "~/core/layouts/applicationLayout";
import { Section } from "~/core/layouts/section";
import { useIsScrollAtTheBottom } from "~/core/layouts/usePageScroll";
import { Modal, ModalHeader, ModalHeaderTitle } from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { ScreenSize, useScreenSize } from "~/core/screenSize";
import { ChildrenProp, StyleProps } from "~/core/types";
import { useCurrentUser } from "~/currentUser/currentUser";
import { CurrentUserMenu } from "~/currentUser/currentUserMenu";
import { theme } from "~/styles/theme";
import { UserAvatar } from "~/user/avatar";

type NavigationMenuProps = {
  navigationItems: NavigationItem[];
};

function NavigationMenu({ navigationItems }: NavigationMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <li>
        <NavButton onClick={() => setIsMenuVisible(true)} ref={buttonElement}>
          <NavLinkIcon>
            <FaEllipsisH />
          </NavLinkIcon>
        </NavButton>
      </li>

      <Modal
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={buttonElement}
        dismissLabel="Fermer"
      >
        <ModalHeader>
          <ModalHeaderTitle>Menu</ModalHeaderTitle>
        </ModalHeader>

        <Section>
          {navigationItems.map((item) => (
            <LinkItem
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuVisible(false)}
            >
              <ItemIcon>
                <item.icon />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{item.label}</ItemMainText>
              </ItemContent>

              <ItemIcon>
                <FaAngleRight />
              </ItemIcon>
            </LinkItem>
          ))}
        </Section>
      </Modal>
    </>
  );
}

type NavigationItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  authorizedGroups: UserGroup[];
};

const MAX_VISIBLE_NAVIGATION_ITEM_SMALL_MEDIA = 5;

// The "menu" button takes one spot.
const LAST_VISIBLE_NAVIGATION_ITEM_INDEX =
  MAX_VISIBLE_NAVIGATION_ITEM_SMALL_MEDIA - 1;

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/animals",
    icon: FaPaw,
    label: "Animaux",
    authorizedGroups: [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ],
  },
  {
    href: "/host-families",
    icon: FaHome,
    label: "FA",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  },
  {
    href: "/events",
    icon: FaCalendarAlt,
    label: "Événements",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    href: "/users",
    icon: FaUser,
    label: "Utilisateurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    href: "/animal-breeds",
    icon: FaDna,
    label: "Races",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    href: "/animal-colors",
    icon: FaPalette,
    label: "Couleurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
];

function showNavigationItem(
  item: NavigationItem,
  currentUser: CurrentUser
): boolean {
  return hasGroups(currentUser, item.authorizedGroups);
}

type NavigationProps = {
  onlyLargeEnough?: boolean;
};

export function Navigation({ onlyLargeEnough = false }: NavigationProps) {
  const { currentUser } = useCurrentUser();
  const { screenSize } = useScreenSize();

  if (onlyLargeEnough && screenSize <= ScreenSize.SMALL) {
    return null;
  }

  const currentUserNavigationItems = NAVIGATION_ITEMS.filter((item) =>
    showNavigationItem(item, currentUser)
  );

  let visibleNavigationItems = currentUserNavigationItems;
  let menuNavigationItems: NavigationItem[] = [];

  if (
    screenSize <= ScreenSize.SMALL &&
    visibleNavigationItems.length > MAX_VISIBLE_NAVIGATION_ITEM_SMALL_MEDIA
  ) {
    visibleNavigationItems = currentUserNavigationItems.slice(
      0,
      LAST_VISIBLE_NAVIGATION_ITEM_INDEX
    );

    menuNavigationItems = currentUserNavigationItems.slice(
      LAST_VISIBLE_NAVIGATION_ITEM_INDEX
    );
  }

  if (visibleNavigationItems.length < 2 && screenSize <= ScreenSize.SMALL) {
    return null;
  }

  return (
    <BaseNavigation>
      {screenSize >= ScreenSize.MEDIUM && (
        <NavigationItemList>
          <NavigationLogoItem href="/">
            <NavigationLogoIcon>
              <AppIcon />
            </NavigationLogoIcon>

            <NavLinkContent>
              <NavigationLogoLabel>Faune</NavigationLogoLabel>
            </NavLinkContent>
          </NavigationLogoItem>
        </NavigationItemList>
      )}

      <NavigationItemList>
        {visibleNavigationItems.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href}>
              <NavLinkIcon>
                <item.icon />
              </NavLinkIcon>

              <NavLinkContent>
                <NavLinkMainText>{item.label}</NavLinkMainText>
              </NavLinkContent>
            </NavLink>
          </li>
        ))}

        {menuNavigationItems.length > 0 && (
          <NavigationMenu navigationItems={menuNavigationItems} />
        )}
      </NavigationItemList>

      {screenSize >= ScreenSize.MEDIUM && <NavigationUserItem />}
    </BaseNavigation>
  );
}

const NavigationLogoItem = styled(LinkItem)`
  justify-content: center;
`;

const NavigationLogoIcon = styled(ItemIcon)`
  font-size: 48px;
`;

const NavigationLogoLabel = styled(ItemMainText)`
  font-family: ${theme.typography.fontFamily.title};
  font-size: 30px;
  font-weight: 600;
`;

function NavigationUserItem() {
  const { currentUser } = useCurrentUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentUserButton = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <NavigationUserItemList>
        <li>
          <NavigationUserButtonItem
            ref={currentUserButton}
            onClick={() => setIsMenuVisible(true)}
          >
            <ItemIcon>
              <UserAvatar user={currentUser} />
            </ItemIcon>

            <NavLinkContent>
              <ItemMainText>{currentUser.displayName}</ItemMainText>
              <ItemSecondaryText>{currentUser.email}</ItemSecondaryText>
            </NavLinkContent>
          </NavigationUserButtonItem>
        </li>
      </NavigationUserItemList>

      <CurrentUserMenu
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={currentUserButton}
        placement="top-start"
      />
    </>
  );
}

const NavigationUserButtonItem = styled(ButtonItem)`
  justify-content: center;
`;

type BaseNavigationProps = ChildrenProp & StyleProps;

function BaseNavigation({ children, ...rest }: BaseNavigationProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();
  const { setState } = useApplicationLayout();

  useEffect(() => {
    setState((s) => ({ ...s, hasNavigation: true }));
    return () => setState((s) => ({ ...s, hasNavigation: false }));
  }, [setState]);

  return (
    <BaseNavigationElement {...rest} $hasScroll={!isAtTheBottom}>
      <BaseNavigationElementContent>{children}</BaseNavigationElementContent>
    </BaseNavigationElement>
  );
}

const BaseNavigationElement = styled.nav<{ $hasScroll: boolean }>`
  z-index: ${theme.zIndex.navigation};
  min-width: 0;

  padding-right: 0;
  padding-right: env(safe-area-inset-right, 0);
  padding-left: 0;
  padding-left: env(safe-area-inset-left, 0);
  padding-bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);

  transition-property: box-shadow;
  transition-duration: ${theme.animation.duration.fast};
  transition-timing-function: ${theme.animation.ease.move};

  @media (max-width: ${theme.screenSizes.small.end}) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${theme.colors.background.primary};
    box-shadow: ${(props) =>
      props.$hasScroll ? `0 -1px 0 0 ${theme.colors.dark[50]}` : "none"};
  }

  @media (min-width: ${theme.screenSizes.medium.start}) {
    grid-area: navigation;
    box-shadow: inset -1px 0 0 0 ${theme.colors.dark[50]};
  }
`;

const BaseNavigationElementContent = styled.div`
  @media (max-width: ${theme.screenSizes.small.end}) {
    width: 100%;
  }

  @media (min-width: ${theme.screenSizes.medium.start}) {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const NavigationItemList = styled.ul`
  padding: ${theme.spacing.x2};
  display: flex;
  align-items: stretch;
  gap: ${theme.spacing.x2};

  @media (max-width: ${theme.screenSizes.small.end}) {
    width: 100%;
    height: ${theme.components.bottomNavHeight};

    & > * {
      flex: 1;
    }
  }

  @media (min-width: ${theme.screenSizes.medium.start}) {
    flex-direction: column;
  }
`;

const NavigationUserItemList = styled(NavigationItemList)`
  margin-top: auto;
`;

type NavLinkProps = LinkItemProps & {
  strict?: boolean;
};

function NavLink({ strict = false, ...rest }: NavLinkProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const isActive = strict
    ? currentPath === rest.href
    : currentPath.startsWith(rest.href);

  return <NavLinkItem {...rest} $isActive={isActive} />;
}

const NavLinkItem = styled(LinkItem)<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "inherit" : theme.colors.dark[300])};
  justify-content: center;

  :active {
    color: ${(props) => (props.$isActive ? "inherit" : theme.colors.dark[500])};
  }
`;

const NavButton = styled(ButtonItem)`
  @media (max-width: 799px) {
    justify-content: center;
  }
`;

const NavLinkContent = styled(ItemContent)`
  @media (max-width: 899px) {
    display: none;
  }
`;

const NavLinkIcon = styled(ItemIcon)`
  @media (min-width: ${theme.screenSizes.medium.start}) {
    font-size: 30px;
  }
`;

const NavLinkMainText = styled(ItemMainText)`
  font-size: 20px;
`;
