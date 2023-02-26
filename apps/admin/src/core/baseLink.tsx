import { Link, NavLink, NavLinkProps } from "@remix-run/react";
import { createPath, parsePath } from "history";
import { forwardRef } from "react";

export type BaseLinkProps = {
  children?: NavLinkProps["children"];
  className?: NavLinkProps["className"];
  disabled?: boolean;
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

export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function BaseLink(
    {
      children,
      className,
      disabled,
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
    ref
  ) {
    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.RefAttributes<HTMLAnchorElement> = {
      ...rest,
      download,
      title,
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
          reloadDocument={reloadDocument}
          replace={replace}
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
        reloadDocument={reloadDocument}
        replace={replace}
        className={defaultCallProp(className)}
        style={defaultCallProp(style)}
        children={defaultCallProp(children)}
      />
    );
  }
);

function defaultCallProp<
  TValue extends string | React.CSSProperties | React.ReactNode
>(
  prop:
    | undefined
    | TValue
    | ((arg: { isActive: boolean }) => undefined | TValue)
) {
  if (typeof prop === "function") {
    return prop({ isActive: false });
  }

  return prop;
}
