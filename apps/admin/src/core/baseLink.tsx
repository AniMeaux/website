import { Link, NavLink, NavLinkProps } from "@remix-run/react";
import { createPath, parsePath } from "history";
import { forwardRef } from "react";

export type BaseLinkProps = {
  to?: NavLinkProps["to"] | null;
  isNavLink?: boolean;
  disabled?: boolean;
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
      disabled,
      shouldOpenInNewTarget,
      reloadDocument,
      className,
      style,
      children,
      title,

      // Because `BaseLink` can be used as a menu item, it might receive other
      // props from @radix-ui/react-dropdown-menu that need to be passed down to
      // the HTML element.
      // We don't type them because they're specific to the lib and they're
      //  implementation details.
      ...rest
    },
    ref
  ) {
    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.RefAttributes<HTMLAnchorElement> = {
      ...rest,
      ref,
      title,
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
