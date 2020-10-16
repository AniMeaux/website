import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";

export type LinkProps = NextLinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/**
 * Simple Wrapper around Next/Link component to Automatically add the anchor.
 */
export function Link({
  // Next link props.
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  passHref = true,

  // All HTML anchor attributes.
  ...rest
}: LinkProps) {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      passHref={passHref}
    >
      {/* The content is passed as children. */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...rest} />
    </NextLink>
  );
}
