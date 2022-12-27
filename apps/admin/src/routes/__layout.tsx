import { UserGroup } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useState } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import {
  SideBar,
  SideBarContent,
  SideBarItem,
  SideBarRootItem,
} from "~/core/layout/sideBar";
import {
  TabBar,
  TabBarItem,
  TabBarMenu,
  TabBarMenuItem,
} from "~/core/layout/tabBar";
import { getPageTitle } from "~/core/pageTitle";
import { NextSearchParams } from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { Icon, IconProps } from "~/generated/icon";
import { theme } from "~/generated/theme";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { GlobalSearch } from "~/routes/resources/global-search";
import { UserAvatar } from "~/users/avatar";
import { hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: {
      id: true,
      displayName: true,
      email: true,
      groups: true,
    },
  });

  return json({ currentUser });
}

export default function Layout() {
  const { currentUser } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,minmax(0px,1fr)] items-start md:gap-2">
      <CurrentUserSideBar currentUser={currentUser} />

      <div className="flex flex-col gap-1 md:pb-2 md:gap-2">
        <header className="w-full bg-white px-safe-1 pt-safe-0.5 pb-0.5 grid grid-cols-[minmax(0px,1fr)_auto] items-center justify-between gap-1 md:sticky md:top-0 md:z-20 md:pt-safe-1 md:pr-safe-2 md:pb-1 md:pl-2 md:grid-cols-[minmax(0px,66%)_auto] md:gap-4">
          <GlobalSearch />
          <CurrentUserMenu currentUser={currentUser} />
        </header>

        <div className="flex flex-col items-center gap-1 md:pr-2 md:gap-2">
          <Outlet />
        </div>

        <CurrentUserTabBar currentUser={currentUser} />
      </div>
    </div>
  );
}

const MAX_VISIBLE_TAB_BAR_ITEM_COUNT = 5;

function CurrentUserTabBar({
  currentUser,
}: {
  currentUser: SerializeFrom<typeof loader>["currentUser"];
}) {
  const navigationItems = ALL_NAVIGATION_ITEMS.filter((item) =>
    hasGroups(currentUser, item.authorizedGroups)
  );

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
    return null;
  }

  return (
    <TabBar>
      {visibleNavigationItems.map((item) => (
        <TabBarItem key={item.icon} icon={item.icon} to={item.to} />
      ))}

      {menuNavigationItems.length > 0 && (
        <TabBarMenu icon="ellipsis">
          {menuNavigationItems.map((item) => (
            <TabBarMenuItem
              key={item.icon}
              icon={item.icon}
              to={item.to}
              label={item.label}
            />
          ))}
        </TabBarMenu>
      )}
    </TabBar>
  );
}

function CurrentUserSideBar({
  currentUser,
}: {
  currentUser: SerializeFrom<typeof loader>["currentUser"];
}) {
  const [isOpened, setIsOpened] = useState(true);

  useEffect(() => {
    setIsOpened(!Boolean(localStorage.getItem("isSideBarCollapsed")));
  }, []);

  useEffect(() => {
    if (isOpened) {
      localStorage.removeItem("isSideBarCollapsed");
    } else {
      localStorage.setItem("isSideBarCollapsed", "true");
    }
  }, [isOpened]);

  const navigationItems = ALL_NAVIGATION_ITEMS.filter((item) =>
    hasGroups(currentUser, item.authorizedGroups)
  );

  return (
    <SideBar isOpened={isOpened} setIsOpened={setIsOpened}>
      <SideBarRootItem logo={nameAndLogo} to="/" alt={getPageTitle()} />

      <SideBarContent>
        {navigationItems.map((item) => (
          <SideBarItem key={item.label} icon={item.icon} to={item.to}>
            {item.label}
          </SideBarItem>
        ))}
      </SideBarContent>
    </SideBar>
  );
}

type NavigationItem = {
  to: BaseLinkProps["to"];
  icon: IconProps["id"];
  label: string;
  authorizedGroups: UserGroup[];
};

const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    to: "/animals",
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
    to: "/foster-families",
    icon: "house",
    label: "FA",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  },
  {
    to: "/events",
    icon: "calendarDays",
    label: "Événements",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/users",
    icon: "user",
    label: "Utilisateurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/breeds",
    icon: "dna",
    label: "Races",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/colors",
    icon: "palette",
    label: "Couleurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
];

function CurrentUserMenu({
  currentUser,
}: {
  currentUser: SerializeFrom<typeof loader>["currentUser"];
}) {
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

        <span className="hidden text-gray-600 md:inline-flex">
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
              to="/me"
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
                method: "post",
                action: createPath({
                  pathname: "/logout",
                  search: new NextSearchParams()
                    .setNext(createPath(location))
                    .toString(),
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
