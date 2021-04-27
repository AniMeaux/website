import cn from "classnames";
import * as React from "react";
import {
  ButtonItem,
  ButtonItemProps,
  ChildrenProp,
  ItemContent,
  ItemContentProps,
  ItemIcon,
  ItemIconProps,
  ItemMainText,
  ItemMainTextProps,
  LinkItem,
  LinkItemProps,
  StyleProps,
} from "../core";
import { useRouter } from "../core/router";
import { useApplicationLayout } from "./applicationLayout";
import { useIsScrollAtTheBottom } from "./usePageScroll";

export type NavigationProps = ChildrenProp & StyleProps;
export function Navigation({ className, children, ...rest }: NavigationProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();
  const { setState } = useApplicationLayout();

  React.useEffect(() => {
    setState((s) => ({ ...s, hasNavigation: true }));
    return () => setState((s) => ({ ...s, hasNavigation: false }));
  }, [setState]);

  return (
    <nav
      {...rest}
      className={cn(
        "Navigation",
        { "Navigation--hasScroll": !isAtTheBottom },
        className
      )}
    >
      <div className="Navigation__content">{children}</div>
    </nav>
  );
}

export type NavigationItemListProps = ChildrenProp & StyleProps;
export function NavigationItemList({
  className,
  ...rest
}: NavigationItemListProps) {
  return <ul {...rest} className={cn("NavigationItemList", className)} />;
}

export type NavItemProps = ChildrenProp;
export function NavItem(props: NavItemProps) {
  return <li {...props} />;
}

export type NavLinkProps = LinkItemProps & {
  strict?: boolean;
};

export function NavLink({ strict = false, className, ...rest }: NavLinkProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const active = strict
    ? currentPath === rest.href
    : currentPath.startsWith(rest.href);

  return (
    <LinkItem
      {...rest}
      className={cn("NavLink", { "NavLink--active": active }, className)}
    />
  );
}

export type NavButtonProps = ButtonItemProps;
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  function NavButton({ className, ...rest }, ref) {
    return (
      <ButtonItem {...rest} ref={ref} className={cn("NavLink", className)} />
    );
  }
);

export type NavLinkContentProps = ItemContentProps;
export function NavLinkContent({ className, ...rest }: NavLinkContentProps) {
  return <ItemContent {...rest} className={cn("NavLinkContent", className)} />;
}

export type NavLinkIconProps = ItemIconProps;
export function NavLinkIcon({ className, ...rest }: NavLinkIconProps) {
  return <ItemIcon {...rest} className={cn("NavLinkIcon", className)} />;
}

export type NavLinkMainTextProps = ItemMainTextProps;
export function NavLinkMainText({ className, ...rest }: NavLinkMainTextProps) {
  return (
    <ItemMainText {...rest} className={cn("NavLinkMainText", className)} />
  );
}
