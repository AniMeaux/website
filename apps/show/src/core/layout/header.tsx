import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, NavLink } from "@remix-run/react";
import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { Config, useConfig } from "~/core/config";
import { createImageMedia } from "~/core/dataDisplay/image";
import { Primitive } from "~/core/primitives";
import { Routes } from "~/core/routing";
import { Icon } from "~/generated/icon";
import logoMedium from "~/images/logoMedium.svg";
import logoSmall from "~/images/logoSmall.svg";

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
    <header className="relative z-20 w-full grid md:hidden grid-cols-1">
      <NavigationMenu.Root className="grid grid-cols-1">
        <NavigationMenu.List className="px-safe-page-narrow pt-safe-0.5 pb-0.5 grid grid-cols-[auto_auto] items-center justify-between gap-2">
          <NavigationMenu.Item className="flex">
            <HomeNavItem />
          </NavigationMenu.Item>

          <NavigationMenu.Item className="flex">
            <NavigationMenu.Trigger
              // We don't want the menu to open or close on hover.
              // https://github.com/radix-ui/primitives/issues/1630
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
              className="group w-4 aspect-square flex items-center justify-center text-[24px] transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic"
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
          className="absolute -z-10 top-0 left-0 w-full bg-white/70 backdrop-blur-2xl px-safe-page-narrow pt-safe-[84px] pb-4 grid grid-cols-1 transition-[transform,opacity] duration-150 data-[state=open]:ease-out data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[state=closed]:ease-in data-[state=closed]:-translate-y-full data-[state=closed]:opacity-0"
        />
      </NavigationMenu.Root>
    </header>
  );
}

function LargeHeader() {
  const config = useConfig();

  return (
    <header className="z-20 hidden md:grid md:grid-cols-1">
      <nav className="px-safe-page-normal pt-safe-1 pb-1 grid grid-cols-[auto_auto] items-center justify-between gap-2">
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
    { to: ticketingUrl, label: "Billetterie" },
    { to: Routes.exhibitors(), label: "Exposants" },
    { to: Routes.program(), label: "Programme" },
    { to: Routes.access(), label: "Accès" },
    { to: Routes.faq(), label: "FAQ" },
  ];
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
          className="w-4 md:w-6 aspect-square"
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
        "group px-1 lg:px-2 flex justify-center text-body-uppercase-emphasis transition-[color,transform] duration-100 ease-in-out hover:text-mystic aria-[current=page]:text-mystic active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic",
        className
      )}
    />
  );
}

NavAction.Content = function NavActionContent(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.span>,
    "className"
  >
) {
  return <Primitive.span {...props} className="relative py-0.5 flex" />;
};

NavAction.Marker = function NavActionMarker(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Primitive.span>,
    "className" | "aria-hidden"
  >
) {
  return (
    <Primitive.span
      {...props}
      aria-hidden
      className="absolute bottom-0 left-0 w-full h-[3px] bg-mystic transition-transform duration-150 ease-in-out origin-left scale-x-0 group-aria-[current=page]:scale-x-100"
    />
  );
};
