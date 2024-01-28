import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { db } from "#core/db.server.ts";
import { SideBar } from "#core/layout/sideBar.tsx";
import { TabBar } from "#core/layout/tabBar.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { DropdownSheet } from "#core/popovers/dropdownSheet";
import { NextSearchParams } from "#core/searchParams.ts";
import { getCurrentUserPreferences } from "#currentUser/preferences.server.ts";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { theme } from "#generated/theme.ts";
import nameAndLogo from "#images/nameAndLogo.svg";
import { GlobalSearch } from "#routes/resources.global-search/input";
import { usePreferencesFetcher } from "#routes/resources.preferences/fetcher";
import { UserAvatar } from "#users/avatar.tsx";
import { hasGroups } from "#users/groups.tsx";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useState } from "react";
import { promiseHash } from "remix-utils/promise";

export async function loader({ request }: LoaderFunctionArgs) {
  const { currentUser, preferences } = await promiseHash({
    preferences: getCurrentUserPreferences(request),
    currentUser: db.currentUser.get(request, {
      select: {
        id: true,
        displayName: true,
        email: true,
        groups: true,
      },
    }),
  });

  return json({ currentUser, preferences });
}

export default function Route() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,minmax(0px,1fr)] items-start">
      <CurrentUserSideBar />

      <div className="flex flex-col" style={{ "--header-height": "80px" }}>
        <header className="w-full bg-white bg-var-white px-safe-1 pt-safe-0.5 pb-0.5 grid grid-cols-[minmax(0px,1fr)_auto] items-center justify-between gap-1 md:sticky md:top-0 md:z-20 md:pt-safe-1 md:pr-safe-2 md:pb-1 md:pl-2 md:grid-cols-[minmax(200px,500px)_auto] md:gap-4 md:border-l md:border-gray-50">
          <GlobalSearch />
          <CurrentUserMenu />
        </header>

        <div className="flex flex-col">
          <Outlet />
        </div>

        <CurrentUserTabBar />
      </div>
    </div>
  );
}

const MAX_VISIBLE_TAB_BAR_ITEM_COUNT = 5;

function CurrentUserTabBar() {
  const { currentUser } = useLoaderData<typeof loader>();
  const navigationItems = getNavigationItems(currentUser);

  let visibleNavigationItems = navigationItems;
  let menuNavigationItems: NavigationItem[] = [];

  if (visibleNavigationItems.length > MAX_VISIBLE_TAB_BAR_ITEM_COUNT) {
    visibleNavigationItems = navigationItems.slice(
      0,
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1,
    );

    menuNavigationItems = navigationItems.slice(
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1,
    );
  }

  if (visibleNavigationItems.length < 2) {
    return <div aria-hidden className="flex pb-safe-0 md:hidden" />;
  }

  return (
    <TabBar>
      {visibleNavigationItems.map((item) => (
        <TabBar.Item key={item.icon} icon={item.icon} to={item.to} />
      ))}

      {menuNavigationItems.length > 0 ? (
        <TabBar.Menu icon="ellipsis">
          {menuNavigationItems.map((item) => (
            <TabBar.MenuItem
              key={item.icon}
              icon={item.icon}
              to={item.to}
              label={item.label}
            />
          ))}
        </TabBar.Menu>
      ) : null}
    </TabBar>
  );
}

function CurrentUserSideBar() {
  useEffect(() => {
    // Clean up old local storage usage.
    localStorage.removeItem("isSideBarCollapsed");
  }, []);

  const { currentUser, preferences } = useLoaderData<typeof loader>();
  const preferencesFetcher = usePreferencesFetcher();

  // Optimistic UI.
  const isOpened = !(
    preferencesFetcher.formData?.isSideBarCollapsed ??
    preferences.isSideBarCollapsed
  );

  const navigationItems = getNavigationItems(currentUser);

  return (
    <SideBar
      isOpened={isOpened}
      onIsOpenedChange={() =>
        preferencesFetcher.submit({
          isSideBarCollapsed: !preferences.isSideBarCollapsed,
        })
      }
    >
      <SideBar.RootItem
        logo={nameAndLogo}
        to={Routes.home.toString()}
        alt={getPageTitle()}
      />

      <SideBar.Content>
        {navigationItems.map((item) => (
          <SideBar.Item asChild key={item.label}>
            <BaseLink isNavLink to={item.to}>
              <SideBar.ItemIcon id={item.icon} />
              <SideBar.ItemContent>{item.label}</SideBar.ItemContent>
            </BaseLink>
          </SideBar.Item>
        ))}
      </SideBar.Content>
    </SideBar>
  );
}

type NavigationItem = {
  to: BaseLinkProps["to"];
  icon: IconProps["id"];
  label: string;
  authorizedGroups: UserGroup[];
};

function getNavigationItems(currentUser: Pick<User, "groups">) {
  return ALL_NAVIGATION_ITEMS.filter((item) =>
    hasGroups(currentUser, item.authorizedGroups),
  );
}

const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    to: Routes.animals.toString(),
    icon: "paw",
    label: "Animaux",
    authorizedGroups: [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
      UserGroup.VOLUNTEER,
    ],
  },
  {
    to: Routes.fosterFamilies.toString(),
    icon: "house",
    label: "Familles d’accueil",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  },
  {
    to: Routes.events.toString(),
    icon: "calendarDays",
    label: "Événements",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.users.toString(),
    icon: "user",
    label: "Utilisateurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.pressArticles.toString(),
    icon: "newspaper",
    label: "Articles de presse",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.breeds.toString(),
    icon: "dna",
    label: "Races",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.colors.toString(),
    icon: "palette",
    label: "Couleurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
];

function CurrentUserMenu() {
  const { currentUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const location = useLocation();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <DropdownSheet open={isOpened} onOpenChange={setIsOpened}>
      <DropdownSheet.Trigger className="rounded-0.5 flex items-center gap-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg">
        <span className="hidden md:inline-flex">{currentUser.displayName}</span>

        <span className="hidden md:inline-flex">
          <UserAvatar size="sm" user={currentUser} />
        </span>

        <span className="inline-flex md:hidden">
          <UserAvatar size="md" user={currentUser} />
        </span>

        <span className="hidden text-[20px] text-gray-600 md:inline-flex">
          <Icon id="caretDown" />
        </span>
      </DropdownSheet.Trigger>

      <DropdownSheet.Portal>
        <DropdownSheet.Content
          side="bottom"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
        >
          <div className="grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-1">
            <UserAvatar size="md" user={currentUser} />
            <div className="flex flex-col">
              <span>{currentUser.displayName}</span>
              <span className="text-caption-default text-gray-500">
                {currentUser.email}
              </span>
            </div>
          </div>

          <hr className="border-t border-gray-100" />

          <Link
            to={Routes.me.toString()}
            onClick={() => setIsOpened(false)}
            className="rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center text-gray-500 text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
          >
            <span className="w-4 h-4 flex items-center justify-center text-[20px]">
              <Icon id="user" />
            </span>

            <span className="text-body-emphasis">Votre profil</span>
          </Link>

          <hr className="border-t border-gray-100" />

          <fetcher.Form
            method="POST"
            action={createPath({
              pathname: Routes.logout.toString(),
              search: NextSearchParams.stringify({
                next: createPath(location),
              }),
            })}
            className="grid"
          >
            <button
              onClick={() => setIsOpened(false)}
              className="rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center text-gray-500 text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
            >
              <span className="w-4 h-4 flex items-center justify-center text-[20px]">
                <Icon id="rightFromBracket" />
              </span>

              <span className="text-body-emphasis">Se déconnecter</span>
            </button>
          </fetcher.Form>
        </DropdownSheet.Content>
      </DropdownSheet.Portal>
    </DropdownSheet>
  );
}
