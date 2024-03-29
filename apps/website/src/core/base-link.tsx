import type { NavLinkProps } from "@remix-run/react";
import { Link, NavLink } from "@remix-run/react";
import { forwardRef } from "react";

export type BaseLinkProps = {
  to?: NavLinkProps["to"] | null;
  isNavLink?: boolean;
  shouldOpenInNewTarget?: boolean;
  reloadDocument?: NavLinkProps["reloadDocument"];
  className?: NavLinkProps["className"];
  style?: NavLinkProps["style"];
  children?: NavLinkProps["children"];
  title?: string;
};

export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function BaseLink(
    {
      to,
      isNavLink = false,
      shouldOpenInNewTarget,
      reloadDocument,
      className,
      style,
      children,
      title,
    },
    ref,
  ) {
    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.RefAttributes<HTMLAnchorElement> = {
      ref,
      title,
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

    if (isNavLink) {
      return (
        <NavLink
          {...commonProps}
          to={to}
          prefetch="intent"
          reloadDocument={reloadDocument}
          className={className}
          style={style}
          children={children}
        />
      );
    }

    return (
      <Link
        {...commonProps}
        to={to}
        prefetch="intent"
        reloadDocument={reloadDocument}
        className={defaultCallProp(className)}
        style={defaultCallProp(style)}
        children={defaultCallProp(children)}
      />
    );
  },
);

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
