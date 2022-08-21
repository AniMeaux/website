import { Link, LinkProps } from "@remix-run/react";
import { createPath, parsePath } from "history";
import { forwardRef } from "react";

export type BaseLinkProps = Omit<LinkProps, "to"> & {
  to?: LinkProps["to"] | null;
  disabled?: boolean;
  shouldOpenInNewTarget?: boolean;
};

export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function BaseLink(
    {
      to,
      disabled,
      shouldOpenInNewTarget,
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
      return <span {...commonProps} aria-disabled />;
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
      return <a {...commonProps} href={createPath(asPath)} />;
    }

    // Content is passed in `commonProps`.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <Link {...commonProps} prefetch={prefetch} to={to} />;
  }
);
