import { hasGroups } from "@animeaux/shared";
import { Prisma, UserGroup } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { createPath } from "history";
import invariant from "tiny-invariant";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { getCurrentUserId } from "~/core/currentUser.server";
import { prisma } from "~/core/db.server";
import {
  TabBar,
  TabBarItem,
  TabBarMenu,
  TabBarMenuItem,
} from "~/core/layout/tabBar";
import { NextParamInput } from "~/core/params";
import { IconProps } from "~/generated/icon";

const currentUserSelect = Prisma.validator<Prisma.UserArgs>()({
  select: {
    displayName: true,
    groups: true,
  },
});

type CurrentUser = Prisma.UserGetPayload<typeof currentUserSelect>;

type LoaderData = {
  currentUser: CurrentUser;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getCurrentUserId(request);

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: currentUserSelect.select,
  });

  invariant(currentUser != null, "User should exists");

  return json<LoaderData>({ currentUser });
};

export default function Layout() {
  const location = useLocation();
  const { currentUser } = useLoaderData<LoaderData>();

  return (
    <>
      <header>
        <BaseLink to="/">Go home</BaseLink>

        <Form method="post" action="/logout">
          <NextParamInput value={createPath(location)} />
          <button type="submit">Logout</button>
        </Form>
      </header>

      <Outlet />

      <CurrentUserTabBar currentUser={currentUser} />
    </>
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
    </TabBar>
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
    to: "/animaux",
    icon: "paw",
    label: "Animaux",
    authorizedGroups: [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ],
  },
  {
    to: "/fa",
    icon: "house",
    label: "FA",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  },
  {
    to: "/evenements",
    icon: "calendarDays",
    label: "Événements",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/utilisateurs",
    icon: "user",
    label: "Utilisateurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/races",
    icon: "dna",
    label: "Races",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: "/coleurs",
    icon: "palette",
    label: "Couleurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
];
