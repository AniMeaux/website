import { BaseLink, BaseLinkProps } from "#core/baseLink.tsx";
import { db } from "#core/db.server.ts";
import { SideBar } from "#core/layout/sideBar.tsx";
import { TabBar } from "#core/layout/tabBar.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { NextSearchParams } from "#core/searchParams.ts";
import { getCurrentUserPreferences } from "#currentUser/preferences.server.ts";
import { Icon, IconProps } from "#generated/icon.tsx";
import { theme } from "#generated/theme.ts";
import nameAndLogo from "#images/nameAndLogo.svg";
import { GlobalSearch } from "#routes/resources.global-search.tsx";
import { usePreferencesFetcher } from "#routes/resources.preferences.tsx";
import { UserAvatar } from "#users/avatar.tsx";
import { hasGroups } from "#users/groups.tsx";
import { User, UserGroup } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LoaderArgs, json } from "@remix-run/node";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { createPath } from "history";
import { useEffect } from "react";
import { promiseHash } from "remix-utils";

export async function loader({ request }: LoaderArgs) {
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
        <header className="w-full bg-white px-safe-1 pt-safe-0.5 pb-0.5 grid grid-cols-[minmax(0px,1fr)_auto] items-center justify-between gap-1 md:sticky md:top-0 md:z-20 md:pt-safe-1 md:pr-safe-2 md:pb-1 md:pl-2 md:grid-cols-[minmax(200px,500px)_auto] md:gap-4 md:border-l md:border-gray-50">
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
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1
    );

    menuNavigationItems = navigationItems.slice(
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1
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
    hasGroups(currentUser, item.authorizedGroups)
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="rounded-0.5 flex items-center gap-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        <span className="hidden md:inline-flex">{currentUser.displayName}</span>

        <span className="hidden md:inline-flex">
          <UserAvatar size="sm" user={currentUser} />
        </span>

        <span className="inline-flex md:hidden">
          <UserAvatar size="lg" user={currentUser} />
        </span>

        <span className="hidden text-[20px] text-gray-600 md:inline-flex">
          <Icon id="caretDown" />
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          className="z-20 shadow-ambient rounded-1 w-[300px] bg-white p-1 flex flex-col gap-1"
        >
          <div className="grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-1">
            <UserAvatar size="lg" user={currentUser} />
            <div className="flex flex-col">
              <span>{currentUser.displayName}</span>
              <span className="text-caption-default text-gray-500">
                {currentUser.email}
              </span>
            </div>
          </div>

          <DropdownMenu.Separator className="border-t border-gray-100" />

          <DropdownMenu.Item asChild>
            <BaseLink
              to={Routes.me.toString()}
              className="rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center text-gray-500 text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
            >
              <span className="w-4 h-4 flex items-center justify-center text-[20px]">
                <Icon id="user" />
              </span>

              <span className="text-body-emphasis">Votre profil</span>
            </BaseLink>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="border-t border-gray-100" />

          <DropdownMenu.Item
            onSelect={() =>
              fetcher.submit(null, {
                method: "POST",
                action: createPath({
                  pathname: Routes.logout.toString(),
                  search: NextSearchParams.stringify({
                    next: createPath(location),
                  }),
                }),
              })
            }
            className="rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center text-gray-500 text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
          >
            <span className="w-4 h-4 flex items-center justify-center text-[20px]">
              <Icon id="rightFromBracket" />
            </span>

            <span className="text-body-emphasis">Se déconnecter</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
