import {
  doesGroupsIntersect,
  User,
  UserGroup,
} from "@animeaux/shared-entities";
import cn from "classnames";
import { UserAvatar } from "core/dataDisplay/avatar";
import {
  ButtonItem,
  ButtonItemProps,
  ItemContent,
  ItemContentProps,
  ItemIcon,
  ItemIconProps,
  ItemMainText,
  ItemMainTextProps,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
} from "core/dataDisplay/item";
import { AppIcon } from "core/icons/appIcon";
import { useApplicationLayout } from "core/layouts/applicationLayout";
import { Section } from "core/layouts/section";
import { useIsScrollAtTheBottom } from "core/layouts/usePageScroll";
import { Modal, ModalHeader, ModalHeaderTitle } from "core/popovers/modal";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";
import {
  FaAngleRight,
  FaDna,
  FaEllipsisH,
  FaHome,
  FaPalette,
  FaPaw,
  FaUser,
} from "react-icons/fa";
import { useCurrentUser } from "user/currentUserContext";
import { CurrentUserProfile } from "user/currentUserProfile";

type NavigationMenuProps = {
  navigationItems: NavigationItem[];
};

function NavigationMenu({ navigationItems }: NavigationMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);

  return (
    <>
      <NavItem>
        <NavButton onClick={() => setIsMenuVisible(true)} ref={buttonElement}>
          <NavLinkIcon>
            <FaEllipsisH />
          </NavLinkIcon>
        </NavButton>
      </NavItem>

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

const maxVisibleNavigationItemSmallMedia = 5;

// The "menu" button takes one spot.
const lastVisibleNavigationItemIndex = maxVisibleNavigationItemSmallMedia - 1;

const navigationItems: NavigationItem[] = [
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

function showNavigationItem(item: NavigationItem, currentUser: User): boolean {
  return doesGroupsIntersect(currentUser.groups, item.authorizedGroups);
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

  const currentUserNavigationItems = navigationItems.filter((item) =>
    showNavigationItem(item, currentUser)
  );

  let visibleNavigationItems = currentUserNavigationItems;
  let menuNavigationItems: NavigationItem[] = [];

  if (
    screenSize <= ScreenSize.SMALL &&
    visibleNavigationItems.length > maxVisibleNavigationItemSmallMedia
  ) {
    visibleNavigationItems = currentUserNavigationItems.slice(
      0,
      lastVisibleNavigationItemIndex
    );
    menuNavigationItems = currentUserNavigationItems.slice(
      lastVisibleNavigationItemIndex
    );
  }

  if (visibleNavigationItems.length < 2 && screenSize <= ScreenSize.SMALL) {
    return null;
  }

  return (
    <BaseNavigation>
      {screenSize >= ScreenSize.MEDIUM && (
        <NavigationItemList>
          <LinkItem href="/" className="NavigationLogo__item">
            <ItemIcon className="NavigationLogo__icon">
              <AppIcon />
            </ItemIcon>

            <NavLinkContent>
              <ItemMainText className="NavigationLogo__label">
                Faune
              </ItemMainText>
            </NavLinkContent>
          </LinkItem>
        </NavigationItemList>
      )}

      <NavigationItemList>
        {visibleNavigationItems.map((item) => (
          <NavItem key={item.href}>
            <NavLink href={item.href}>
              <NavLinkIcon>
                <item.icon />
              </NavLinkIcon>

              <NavLinkContent>
                <NavLinkMainText>{item.label}</NavLinkMainText>
              </NavLinkContent>
            </NavLink>
          </NavItem>
        ))}

        {menuNavigationItems.length > 0 && (
          <NavigationMenu navigationItems={menuNavigationItems} />
        )}
      </NavigationItemList>

      {screenSize >= ScreenSize.MEDIUM && <NavigationUserItem />}
    </BaseNavigation>
  );
}

function NavigationUserItem() {
  const { currentUser } = useCurrentUser();
  const [isCurrentUserProfileVisible, setIsCurrentUserProfileVisible] =
    React.useState(false);
  const currentUserButton = React.useRef<HTMLButtonElement>(null!);

  return (
    <>
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
    </>
  );
}

type BaseNavigationProps = ChildrenProp & StyleProps;
function BaseNavigation({ className, children, ...rest }: BaseNavigationProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();
  const { setState } = useApplicationLayout();

  React.useEffect(() => {
    setState((s) => ({ ...s, hasNavigation: true }));
    return () => setState((s) => ({ ...s, hasNavigation: false }));
  }, [setState]);

  return (
    <nav
      {...rest}
      className={cn(
        "Navigation",
        { "Navigation--hasScroll": !isAtTheBottom },
        className
      )}
    >
      <div className="Navigation__content">{children}</div>
    </nav>
  );
}

type NavigationItemListProps = ChildrenProp & StyleProps;
function NavigationItemList({ className, ...rest }: NavigationItemListProps) {
  return <ul {...rest} className={cn("NavigationItemList", className)} />;
}

type NavItemProps = ChildrenProp;
function NavItem(props: NavItemProps) {
  return <li {...props} />;
}

type NavLinkProps = LinkItemProps & {
  strict?: boolean;
};

function NavLink({ strict = false, className, ...rest }: NavLinkProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const active = strict
    ? currentPath === rest.href
    : currentPath.startsWith(rest.href);

  return (
    <LinkItem
      {...rest}
      className={cn("NavLink", { "NavLink--active": active }, className)}
    />
  );
}

type NavButtonProps = ButtonItemProps;
const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  function NavButton({ className, ...rest }, ref) {
    return (
      <ButtonItem {...rest} ref={ref} className={cn("NavLink", className)} />
    );
  }
);

type NavLinkContentProps = ItemContentProps;
function NavLinkContent({ className, ...rest }: NavLinkContentProps) {
  return <ItemContent {...rest} className={cn("NavLinkContent", className)} />;
}

type NavLinkIconProps = ItemIconProps;
function NavLinkIcon({ className, ...rest }: NavLinkIconProps) {
  return <ItemIcon {...rest} className={cn("NavLinkIcon", className)} />;
}

type NavLinkMainTextProps = ItemMainTextProps;
function NavLinkMainText({ className, ...rest }: NavLinkMainTextProps) {
  return (
    <ItemMainText {...rest} className={cn("NavLinkMainText", className)} />
  );
}
