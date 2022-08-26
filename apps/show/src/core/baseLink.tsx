import { Link, NavLink, NavLinkProps } from "@remix-run/react";
import { createPath, parsePath } from "history";
import { forwardRef } from "react";

export type BaseLinkProps = Omit<NavLinkProps, "to"> & {
  to?: NavLinkProps["to"] | null;
  isNavLink?: boolean;
  disabled?: boolean;
  shouldOpenInNewTarget?: boolean;
};

export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function BaseLink(
    {
      to,
      isNavLink = false,
      disabled,
      shouldOpenInNewTarget,
      className,
      style,
      children,
      // Prefetch on hover by default.
      prefetch = "intent",
      ...rest
    },
    ref
  ) {
    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.RefAttributes<HTMLAnchorElement> = {
      ...rest,
      ref,
    };

    if (disabled || to == null) {
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

    const asPath = typeof to === "string" ? parsePath(to) : to;

    // External link.
    if (asPath.pathname?.includes(":")) {
      // Content is passed in `commonProps`.
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return (
        <a
          {...commonProps}
          href={createPath(asPath)}
          className={defaultCallProp(className)}
          style={defaultCallProp(style)}
          children={defaultCallProp(children)}
        />
      );
    }

    if (isNavLink) {
      return (
        <NavLink
          {...commonProps}
          to={to}
          prefetch={prefetch}
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
        prefetch={prefetch}
        className={defaultCallProp(className)}
        style={defaultCallProp(style)}
        children={defaultCallProp(children)}
      />
    );
  }
);

function defaultCallProp<
  TProp extends
    | BaseLinkProps["className"]
    | BaseLinkProps["style"]
    | BaseLinkProps["children"]
>(prop: TProp) {
  if (typeof prop === "function") {
    return prop({ isActive: false });
  }

  return prop;
}
