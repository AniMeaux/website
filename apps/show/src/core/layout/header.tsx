import { cn } from "@animeaux/core"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { createPath, Link, NavLink, useLocation } from "@remix-run/react"
import { Children, forwardRef, isValidElement } from "react"
import type { Except } from "type-fest"

import { createImageMedia } from "#i/core/data-display/image.js"
import type { To } from "#i/core/navigation.js"
import { Routes } from "#i/core/navigation.js"
import { Icon } from "#i/generated/icon.js"
import logoMedium from "#i/images/logo-medium.svg"
import logoSmall from "#i/images/logo-small.svg"

export const Header = {
  Root: function HeaderRoot(props: React.PropsWithChildren<{ toHome?: To }>) {
    return (
      <>
        <HeaderRootSmall {...props} />
        <HeaderRootLarge {...props} />
      </>
    )
  },

  NavItem: forwardRef<
    React.ElementRef<typeof NavLink>,
    React.PropsWithChildren<
      Except<
        React.ComponentPropsWithoutRef<typeof NavLink>,
        "prefetch" | "role" | "className" | "children"
      >
    > & {
      exclude?: string
    }
  >(function HeaderNavItem(
    {
      to,
      exclude,
      children,

      // Allow usages with `asChild`.
      ...props
    },
    ref,
  ) {
    const location = useLocation()

    function isReallyActive({ isActive }: { isActive: boolean }) {
      if (exclude == null) {
        return isActive
      }

      return isActive && !location.pathname.startsWith(exclude)
    }

    return (
      <NavLink
        {...props}
        ref={ref}
        to={to}
        prefetch="intent"
        role="menuitem"
        className={(props) =>
          cn(
            "flex justify-center px-1 text-body-uppercase-emphasis transition-[color,scale] focus-visible:focus-ring active:scale-95 lg:px-2",

            isReallyActive(props) ? "text-mystic" : "hover:text-mystic",
          )
        }
      >
        {(props) => (
          <span className="relative flex py-0.5">
            {children}

            <span
              aria-hidden
              className={cn(
                "absolute bottom-0 left-0 h-0.25 w-full origin-left scale-x-0 bg-mystic transition-transform duration-slow",
                isReallyActive(props) ? "scale-x-100" : undefined,
              )}
            />
          </span>
        )}
      </NavLink>
    )
  }),
}

function HeaderRootSmall({ children }: React.PropsWithChildren) {
  const navItems = Children.toArray(children).filter(
    (child): child is React.ReactElement<{ to: To }> => {
      return (
        // Cast to `object` for `"property" in object` to be allowed.
        isValidElement<object>(child) &&
        "to" in child.props &&
        child.props.to != null
      )
    },
  )

  return (
    <header className="relative z-header grid w-full grid-cols-1 md:hidden">
      <NavigationMenu.Root className="grid grid-cols-1">
        <NavigationMenu.List className="grid grid-cols-auto-auto items-center justify-between gap-2 pt-safe-0.5 px-safe-page-narrow pb-0.5">
          <NavigationMenu.Item className="flex">
            <NavItemHome />
          </NavigationMenu.Item>

          {navItems.length > 0 ? (
            <NavigationMenu.Item className="flex">
              <NavigationMenu.Trigger
                // We don't want the menu to open or close on hover.
                // https://github.com/radix-ui/primitives/issues/1630
                onPointerMove={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                className="group/menu-trigger flex aspect-square w-4 items-center justify-center icon-24 transition-transform duration-100 focus-visible:focus-ring active:scale-95"
              >
                <Icon
                  id="bars-light"
                  className="group-data-opened/menu-trigger:hidden"
                />
                <Icon
                  id="x-mark-light"
                  className="group-data-closed/menu-trigger:hidden"
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="grid grid-cols-1 gap-2">
                {navItems.map((navItem) => (
                  <NavigationMenu.Link
                    key={
                      typeof navItem.props.to === "string"
                        ? navItem.props.to
                        : createPath(navItem.props.to)
                    }
                    asChild
                  >
                    {navItem}
                  </NavigationMenu.Link>
                ))}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : null}
        </NavigationMenu.List>

        <NavigationMenu.Viewport
          // We don't want the menu to close on hover.
          // https://github.com/radix-ui/primitives/issues/1630
          onPointerEnter={(event) => event.preventDefault()}
          onPointerLeave={(event) => event.preventDefault()}
          className={cn(
            "absolute top-0 left-0 -z-just-above grid w-full grid-cols-1 bg-white/70 pt-safe-7 px-safe-page-narrow pb-4 backdrop-blur-2xl",
            "-out-translate-y-full animation-duration-slow out-opacity-0 data-opened:animate-enter data-closed:animate-exit",
          )}
        />
      </NavigationMenu.Root>
    </header>
  )
}

function HeaderRootLarge({ children }: React.PropsWithChildren) {
  return (
    <header className="z-header hidden md:grid md:grid-cols-1">
      <nav className="grid grid-cols-auto-auto items-center justify-between gap-2 pt-safe-1 px-safe-page-normal pb-1">
        <NavItemHome />

        {children != null ? (
          <div className="grid grid-flow-col items-center justify-end">
            {children}
          </div>
        ) : null}
      </nav>
    </header>
  )
}

function NavItemHome() {
  return (
    <Link
      to={Routes.home.toString()}
      prefetch="intent"
      className="transition-transform focus-visible:focus-ring active:scale-95"
    >
      <picture>
        <source srcSet={logoMedium} media={createImageMedia("md")} />
        <img
          src={logoSmall}
          alt="Salon des Ani’Meaux"
          className="aspect-square w-4 md:w-6"
        />
      </picture>
    </Link>
  )
}
