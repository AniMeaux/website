import type { Config } from "#core/config.ts";
import { useConfig } from "#core/config.ts";
import { createImageMedia } from "#core/dataDisplay/image.tsx";
import { hasShowEnded } from "#core/dates.ts";
import { Routes } from "#core/navigation.tsx";
import { Icon } from "#generated/icon.tsx";
import logoMedium from "#images/logoMedium.svg";
import logoSmall from "#images/logoSmall.svg";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, NavLink } from "@remix-run/react";
import { forwardRef } from "react";

export function Header() {
  return (
    <>
      <SmallHeader />
      <LargeHeader />
    </>
  );
}

function SmallHeader() {
  const config = useConfig();

  return (
    <header className="relative z-20 grid w-full grid-cols-1 md:hidden">
      <NavigationMenu.Root className="grid grid-cols-1">
        <NavigationMenu.List className="grid grid-cols-[auto_auto] items-center justify-between gap-2 pb-0.5 pt-safe-0.5 px-safe-page-narrow">
          <NavigationMenu.Item className="flex">
            <HomeNavItem />
          </NavigationMenu.Item>

          <NavigationMenu.Item className="flex">
            <NavigationMenu.Trigger
              // We don't want the menu to open or close on hover.
              // https://github.com/radix-ui/primitives/issues/1630
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
              className="group flex aspect-square w-4 items-center justify-center text-[24px] transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic"
            >
              <Icon id="menu" className="group-data-[state=open]:hidden" />
              <Icon id="close" className="group-data-[state=closed]:hidden" />
            </NavigationMenu.Trigger>

            <NavigationMenu.Content className="grid grid-cols-1 gap-2">
              {getNavigationItems(config).map(({ to, label }) => (
                <NavigationMenu.Link asChild key={to}>
                  <NavItem to={to}>{label}</NavItem>
                </NavigationMenu.Link>
              ))}
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Viewport
          forceMount
          // We don't want the menu to close on hover.
          // https://github.com/radix-ui/primitives/issues/1630
          onPointerEnter={(event) => event.preventDefault()}
          onPointerLeave={(event) => event.preventDefault()}
          className="absolute left-0 top-0 -z-10 grid w-full grid-cols-1 bg-white/70 pb-4 backdrop-blur-2xl transition-[transform,opacity] duration-150 pt-safe-[84px] px-safe-page-narrow data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=closed]:ease-in data-[state=open]:ease-out"
        />
      </NavigationMenu.Root>
    </header>
  );
}

function LargeHeader() {
  const config = useConfig();

  return (
    <header className="z-20 hidden md:grid md:grid-cols-1">
      <nav className="grid grid-cols-[auto_auto] items-center justify-between gap-2 pb-1 pt-safe-1 px-safe-page-normal">
        <HomeNavItem />

        <div className="grid grid-flow-col items-center justify-end">
          {getNavigationItems(config).map(({ to, label }) => (
            <NavItem key={to} to={to}>
              {label}
            </NavItem>
          ))}
        </div>
      </nav>
    </header>
  );
}

function getNavigationItems({ ticketingUrl }: Config) {
  return [
    hasShowEnded() ? null : { to: ticketingUrl, label: "Billetterie" },
    { to: Routes.exhibitors(), label: "Exposants" },
    { to: Routes.program(), label: "Programme" },
    { to: Routes.access(), label: "Accès" },
    { to: Routes.faq(), label: "FAQ" },
  ].filter(Boolean);
}

function HomeNavItem({
  onClick,
}: Pick<React.ComponentPropsWithoutRef<typeof Link>, "onClick">) {
  return (
    <Link
      to={Routes.home()}
      prefetch="intent"
      onClick={onClick}
      className="transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic"
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
  );
}

const NavItem = forwardRef<
  React.ElementRef<typeof NavLink>,
  React.PropsWithChildren<
    Pick<React.ComponentPropsWithoutRef<typeof NavLink>, "to">
  >
>(function NavItem({ children, to, ...rest }, ref) {
  return (
    <NavAction asChild>
      <NavLink {...rest} ref={ref} to={to} prefetch="intent" role="menuitem">
        <NavAction.Content>
          {children}
          <NavAction.Marker />
        </NavAction.Content>
      </NavLink>
    </NavAction>
  );
});

function NavAction({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.button>) {
  return (
    <Primitive.button
      {...rest}
      className={cn(
        "group flex justify-center px-1 transition-[color,transform] duration-100 ease-in-out text-body-uppercase-emphasis active:scale-95 aria-[current=page]:text-mystic focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic hover:text-mystic lg:px-2",
        className,
      )}
    />
  );
}

NavAction.Content = function NavActionContent(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.span>,
    "className"
  >,
) {
  return <Primitive.span {...props} className="relative flex py-0.5" />;
};

NavAction.Marker = function NavActionMarker(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.span>,
    "className" | "aria-hidden"
  >,
) {
  return (
    <Primitive.span
      {...props}
      aria-hidden
      className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-mystic transition-transform duration-150 ease-in-out group-aria-[current=page]:scale-x-100"
    />
  );
};
