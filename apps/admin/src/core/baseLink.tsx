import type { LocationState } from "#core/locationState";
import { useLocationState } from "#core/locationState";
import type { NavLinkProps } from "@remix-run/react";
import { Link, NavLink } from "@remix-run/react";
import { forwardRef } from "react";

export type BaseLinkProps = {
  children?: NavLinkProps["children"];
  className?: NavLinkProps["className"];
  download?: string | boolean;
  isNavLink?: boolean;
  prefetch?: NavLinkProps["prefetch"];
  reloadDocument?: NavLinkProps["reloadDocument"];
  replace?: NavLinkProps["replace"];
  shouldOpenInNewTarget?: boolean;
  style?: NavLinkProps["style"];
  title?: string;
  to?: NavLinkProps["to"] | null;
};

export const BaseLink = forwardRef<
  React.ComponentRef<typeof Link>,
  BaseLinkProps
>(function BaseLink(
  {
    children,
    className,
    download,
    isNavLink = false,
    prefetch = "intent",
    reloadDocument,
    replace,
    shouldOpenInNewTarget,
    style,
    title,
    to,

    // Because `BaseLink` can be used as a menu item, it might receive other
    // props from @radix-ui/react-dropdown-menu that need to be passed down to
    // the HTML element.
    // We don't type them because they're specific to the lib and they're
    //  implementation details.
    ...rest
  },
  ref,
) {
  const { fromApp } = useLocationState();

  const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.RefAttributes<HTMLAnchorElement> = {
    ...rest,
    download,
    title,
    ref,
  };

  if (to == null) {
    return (
      <span
        {...commonProps}
        aria-disabled
        className={defaultCallProp(className)}
        style={defaultCallProp(style)}
        children={defaultCallProp(children)}
      />
    );
  }

  if (shouldOpenInNewTarget) {
    commonProps.target = "_blank";
    commonProps.rel = "noopener noreferrer";
  }

  const internalCommonProps: Omit<
    NavLinkProps,
    "className" | "style" | "children"
  > = {
    to,
    state: { fromApp: !replace || fromApp } satisfies LocationState,
    prefetch,
    reloadDocument,
    replace,
  };

  if (isNavLink) {
    return (
      <NavLink
        {...commonProps}
        {...internalCommonProps}
        className={className}
        style={style}
        children={children}
      />
    );
  }

  return (
    <Link
      {...commonProps}
      {...internalCommonProps}
      className={defaultCallProp(className)}
      style={defaultCallProp(style)}
      children={defaultCallProp(children)}
    />
  );
});

function defaultCallProp<
  TValue extends string | React.CSSProperties | React.ReactNode,
>(
  prop:
    | undefined
    | TValue
    | ((arg: {
        isActive: boolean;
        isPending: boolean;
        isTransitioning: boolean;
      }) => undefined | TValue),
) {
  if (typeof prop === "function") {
    return prop({ isActive: false, isPending: false, isTransitioning: false });
  }

  return prop;
}
