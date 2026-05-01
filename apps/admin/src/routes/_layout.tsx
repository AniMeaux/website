import type { User } from "@animeaux/prisma"
import { UserGroup } from "@animeaux/prisma"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
} from "@remix-run/react"
import { createPath } from "history"
import { useEffect, useState } from "react"
import { promiseHash } from "remix-utils/promise"

import type { BaseLinkProps } from "#i/core/base-link.js"
import { BaseLink } from "#i/core/base-link.js"
import { db } from "#i/core/db.server.js"
import { SideBar } from "#i/core/layout/side-bar.js"
import { TabBar } from "#i/core/layout/tab-bar.js"
import { useCurrentUserForMonitoring } from "#i/core/monitoring.js"
import { Routes } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { DropdownSheet } from "#i/core/popovers/dropdown-sheet.js"
import { NextSearchParams } from "#i/core/search-params.js"
import { getCurrentUserPreferences } from "#i/current-user/preferences.server.js"
import type { IconName } from "#i/generated/icon.js"
import { Icon } from "#i/generated/icon.js"
import { Spacing } from "#i/generated/theme.js"
import nameAndLogo from "#i/images/name-and-logo.svg"
import { GlobalSearch } from "#i/routes/resources.global-search/input.js"
import { usePreferencesFetcher } from "#i/routes/resources.preferences/fetcher.js"
import { UserAvatar } from "#i/users/avatar.js"
import { hasGroups } from "#i/users/groups.js"

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
  })

  return json({ currentUser, preferences })
}

export default function Route() {
  const { currentUser } = useLoaderData<typeof loader>()

  useCurrentUserForMonitoring(currentUser)

  return (
    <div className="grid grid-cols-1 items-start md:grid-cols-auto-fr">
      <CurrentUserSideBar />

      <div className="flex flex-col" style={{ "--header-height": "60px" }}>
        <header className="grid w-full grid-cols-fr-auto items-center justify-between gap-1 bg-white pt-safe-0.5 px-safe-1.5 pb-0.5 md:sticky md:top-0 md:z-20 md:grid-cols-[minmax(200px,500px)_auto] md:gap-4 md:border-l md:border-gray-50 md:pt-safe-1 md:pr-safe-2 md:pb-1 md:pl-2">
          <GlobalSearch currentUser={currentUser} />
          <CurrentUserMenu />
        </header>

        <div className="flex flex-col">
          <Outlet />
        </div>

        <CurrentUserTabBar />
      </div>
    </div>
  )
}

const MAX_VISIBLE_TAB_BAR_ITEM_COUNT = 5

function CurrentUserTabBar() {
  const { currentUser } = useLoaderData<typeof loader>()
  const navigationItems = getNavigationItems(currentUser)

  let visibleNavigationItems = navigationItems
  let menuNavigationItems: NavigationItem[] = []

  if (visibleNavigationItems.length > MAX_VISIBLE_TAB_BAR_ITEM_COUNT) {
    visibleNavigationItems = navigationItems.slice(
      0,
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1,
    )

    menuNavigationItems = navigationItems.slice(
      MAX_VISIBLE_TAB_BAR_ITEM_COUNT - 1,
    )
  }

  if (visibleNavigationItems.length < 2) {
    return <div aria-hidden className="flex pb-safe-0 md:hidden" />
  }

  return (
    <TabBar>
      {visibleNavigationItems.map((item) => (
        <TabBar.Item key={item.icon} icon={item.icon} to={item.to} />
      ))}

      {menuNavigationItems.length > 0 ? (
        <TabBar.Menu icon="icon-ellipsis-solid">
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
  )
}

function CurrentUserSideBar() {
  useEffect(() => {
    // Clean up old local storage usage.
    localStorage.removeItem("isSideBarCollapsed")
  }, [])

  const { currentUser, preferences } = useLoaderData<typeof loader>()
  const preferencesFetcher = usePreferencesFetcher()

  // Optimistic UI.
  const isOpened = !(
    preferencesFetcher.formData?.isSideBarCollapsed ??
    preferences.isSideBarCollapsed
  )

  const navigationItems = getNavigationItems(currentUser)

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
              <SideBar.ItemIcon href={item.icon} />
              <SideBar.ItemContent>{item.label}</SideBar.ItemContent>
            </BaseLink>
          </SideBar.Item>
        ))}
      </SideBar.Content>
    </SideBar>
  )
}

type NavigationItem = {
  to: BaseLinkProps["to"]
  icon: IconName
  label: string
  authorizedGroups: UserGroup[]
}

function getNavigationItems(currentUser: Pick<User, "groups">) {
  return ALL_NAVIGATION_ITEMS.filter((item) =>
    hasGroups(currentUser, item.authorizedGroups),
  )
}

const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    to: Routes.dashboard.toString(),
    icon: "icon-table-layout-solid",
    label: "Tableau de bord",
    authorizedGroups: [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.SHOW_ORGANIZER,
    ],
  },
  {
    to: Routes.animals.toString(),
    icon: "icon-paw-solid",
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
    icon: "icon-house-solid",
    label: "Familles d’accueil",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  },
  {
    to: Routes.events.toString(),
    icon: "icon-calendar-days-solid",
    label: "Événements",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.users.toString(),
    icon: "icon-user-solid",
    label: "Utilisateurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.activity.toString(),
    icon: "icon-wave-pulse-solid",
    label: "Activité",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.pressArticles.toString(),
    icon: "icon-newspaper-solid",
    label: "Articles de presse",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.breeds.toString(),
    icon: "icon-dna-solid",
    label: "Races",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.colors.toString(),
    icon: "icon-palette-solid",
    label: "Couleurs",
    authorizedGroups: [UserGroup.ADMIN],
  },
  {
    to: Routes.show.toString(),
    icon: "icon-show-solid",
    label: "Salon",
    authorizedGroups: [UserGroup.ADMIN, UserGroup.SHOW_ORGANIZER],
  },
]

function CurrentUserMenu() {
  const { currentUser } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const location = useLocation()
  const [isOpened, setIsOpened] = useState(false)

  return (
    <DropdownSheet open={isOpened} onOpenChange={setIsOpened}>
      <DropdownSheet.Trigger className="flex items-center gap-1 rounded-0.5 focus-ring-spaced focus-visible:focus-ring">
        <span className="hidden md:inline-flex">{currentUser.displayName}</span>

        <span className="hidden md:inline-flex">
          <UserAvatar size="sm" user={currentUser} />
        </span>

        <span className="inline-flex md:hidden">
          <UserAvatar size="md" user={currentUser} />
        </span>

        <span className="hidden icon-2 text-gray-600 md:inline-flex">
          <Icon href="icon-caret-down-solid" />
        </span>
      </DropdownSheet.Trigger>

      <DropdownSheet.Portal>
        <DropdownSheet.Content
          side="bottom"
          sideOffset={Spacing.unitPx}
          collisionPadding={Spacing.unitPx}
        >
          <div className="grid grid-cols-auto-fr items-center gap-1">
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
            className="grid cursor-pointer grid-cols-auto-fr items-center rounded-0.5 pr-1 text-left text-gray-500 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100"
          >
            <span className="flex h-4 w-4 items-center justify-center icon-2">
              <Icon href="icon-user-solid" />
            </span>

            <span className="text-body-emphasis">Votre profil</span>
          </Link>

          <hr className="border-t border-gray-100" />

          <fetcher.Form
            method="POST"
            action={createPath({
              pathname: Routes.logout.toString(),
              search: NextSearchParams.format({ next: createPath(location) }),
            })}
            className="grid"
          >
            <button
              onClick={() => setIsOpened(false)}
              className="grid cursor-pointer grid-cols-auto-fr items-center rounded-0.5 pr-1 text-left text-gray-500 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100"
            >
              <span className="flex h-4 w-4 items-center justify-center icon-2">
                <Icon href="icon-right-from-bracket-solid" />
              </span>

              <span className="text-body-emphasis">Se déconnecter</span>
            </button>
          </fetcher.Form>
        </DropdownSheet.Content>
      </DropdownSheet.Portal>
    </DropdownSheet>
  )
}
