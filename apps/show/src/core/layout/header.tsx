import { createImageMedia } from "#core/data-display/image";
import { Routes } from "#core/navigation";
import logoMedium from "#images/logo-medium.svg";
import logoSmall from "#images/logo-small.svg";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "@remix-run/react";

export function Header() {
  const location = useLocation();

  if (
    !CLIENT_ENV.FEATURE_FLAG_SITE_ONLINE &&
    location.pathname === Routes.home()
  ) {
    return null;
  }

  return (
    <>
      <SmallHeader />
      <LargeHeader />
    </>
  );
}

function SmallHeader() {
  return (
    <header className="relative z-20 grid w-full grid-cols-1 md:hidden">
      <NavigationMenu.Root className="grid grid-cols-1">
        <NavigationMenu.List className="grid grid-cols-[auto_auto] items-center justify-between gap-2 pb-0.5 pt-safe-0.5 px-safe-page-narrow">
          <NavigationMenu.Item className="flex">
            <HomeNavItem />
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
  return (
    <header className="z-20 hidden md:grid md:grid-cols-1">
      <nav className="grid grid-cols-[auto_auto] items-center justify-between gap-2 pb-1 pt-safe-1 px-safe-page-normal">
        <HomeNavItem />
      </nav>
    </header>
  );
}

function HomeNavItem({
  onClick,
}: Pick<React.ComponentPropsWithoutRef<typeof Link>, "onClick">) {
  return (
    <Link
      to={Routes.home()}
      prefetch="intent"
      onClick={onClick}
      className="transition-transform duration-100 ease-in-out active:scale-95 focus-visible:focus-compact-mystic"
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

function NavAction({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.button>) {
  return (
    <Primitive.button
      {...rest}
      className={cn(
        "group flex justify-center px-1 transition-[color,transform] duration-100 ease-in-out text-body-uppercase-emphasis active:scale-95 aria-[current=page]:text-mystic focus-visible:focus-compact-mystic hover:text-mystic lg:px-2",
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
