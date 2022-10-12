import { hasGroups } from "@animeaux/shared";
import { Prisma, UserGroup } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { json, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import { createPath } from "history";
import { useRef } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { getCurrentUser } from "~/core/currentUser.server";
import { Adornment } from "~/core/formElements/adornment";
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
import { NextParamInput } from "~/core/params";
import { Icon, IconProps } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { UserAvatar } from "~/user/avatar";

const currentUserSelect = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    displayName: true,
    email: true,
    groups: true,
  },
});

type CurrentUser = Prisma.UserGetPayload<typeof currentUserSelect>;

type LoaderData = {
  currentUser: CurrentUser;
};

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getCurrentUser(request, {
    select: currentUserSelect.select,
  });

  return json<LoaderData>({ currentUser });
};

export default function Layout() {
  const { currentUser } = useLoaderData<LoaderData>();

  return (
    <div className="grid grid-cols-1 md:h-screen md:grid-cols-[auto,minmax(0px,1fr)] md:gap-2">
      <CurrentUserSideBar currentUser={currentUser} />

      <div className="grid grid-cols-1 gap-1 md:min-h-min md:grid-rows-[auto,minmax(0px,1fr)] md:gap-2">
        <header className="bg-white px-safe-1 py-0.5 grid grid-cols-[minmax(0px,1fr)_auto] items-center justify-between gap-1 md:px-2 md:py-1 md:grid-cols-[minmax(0px,66%)_auto] md:gap-4">
          <SearchInput />
          <CurrentUserMenu currentUser={currentUser} />
        </header>

        <Outlet />
        <CurrentUserTabBar currentUser={currentUser} />
      </div>
    </div>
  );
}

const MAX_VISIBLE_TAB_BAR_ITEM_COUNT = 5;

function CurrentUserTabBar({
  currentUser,
}: {
  currentUser: LoaderData["currentUser"];
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
  currentUser: LoaderData["currentUser"];
}) {
  const navigationItems = ALL_NAVIGATION_ITEMS.filter((item) =>
    hasGroups(currentUser, item.authorizedGroups)
  );

  return (
    <SideBar>
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

function SearchInput() {
  return (
    <button className="rounded-0.5 bg-gray-100 p-1 grid grid-cols-[auto_minmax(0px,1fr)] items-center gap-0.5 text-left transition-colors duration-100 ease-in-out hover:bg-gray-200 md:px-2">
      <Adornment>
        <Icon id="magnifyingGlass" />
      </Adornment>

      <span className="text-gray-500">
        Recherche globale{" "}
        <span className="hidden md:inline">(appuyer sur ”/”)</span>
      </span>
    </button>
  );
}

function CurrentUserMenu({
  currentUser,
}: {
  currentUser: LoaderData["currentUser"];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const location = useLocation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-1">
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
          sideOffset={20}
          collisionPadding={10}
          className="z-20 shadow-xl rounded-1 w-[300px] bg-white p-1 grid grid-cols-1 gap-1"
        >
          <div className="grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-1">
            <UserAvatar size="lg" user={currentUser} />
            <div className="grid grid-cols-1">
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

              <span className="text-body-emphasis">Votre profile</span>
            </BaseLink>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="border-t border-gray-100" />

          <Form ref={formRef} method="post" action="/logout" className="hidden">
            <NextParamInput value={createPath(location)} />
          </Form>

          <DropdownMenu.Item
            onSelect={() => submit(formRef.current)}
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
