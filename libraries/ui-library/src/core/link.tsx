import NextLink from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { ChildrenProp, StyleProps } from "./types";

function segmentize(uri: string): string[] {
  return (
    uri
      // Strip starting/ending slashes.
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
  );
}

function addQuery(pathname: string, query: string | null): string {
  if (query == null) {
    return pathname;
  }

  return `${pathname}?${query}`;
}

// Inspired by: https://github.com/reach/router/blob/master/src/lib/utils.js#L143
export function resolveUrl(from: string, to: string): string {
  // /baz/qux, /foo/bar => /foo/bar
  if (to.startsWith("/")) {
    return to;
  }

  const [fromPathname] = from.split("?");
  const [toPathname, toQuery] = to.split("?");

  const fromSegments = segmentize(fromPathname);
  const toSegments = segmentize(toPathname);

  // /users?b=c, ?a=b => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(fromPathname, toQuery);
  }

  const allSegments = fromSegments.concat(toSegments);

  // /users/789, profile => /users/789/profile
  if (!toSegments[0].startsWith(".")) {
    return addQuery(
      (fromPathname === "/" ? "" : "/") + allSegments.join("/"),
      toQuery
    );
  }

  // /users/123, ./        =>  /users/123
  // /users/123, ../       =>  /users
  // /users/123, ../..     =>  /
  // /a/b/c/d,   ../../one =>  /a/b/one
  // /a/b/c/d,   .././one  =>  /a/b/c/one
  const segments: string[] = [];

  allSegments.forEach((segment) => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery(
    (fromPathname === "/" ? "" : "/") + segments.join("/"),
    toQuery
  );
}

export type LinkProps = ChildrenProp &
  StyleProps & {
    href: string;
    shouldOpenInNewTab?: boolean;
    disabled?: boolean;
  };

/**
 * Simple Wrapper around Next/Link component to Automatically add the anchor.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    { href, disabled = false, shouldOpenInNewTab = false, ...rest },
    ref
  ) {
    const router = useRouter();

    if (disabled) {
      return <span {...rest} ref={ref} />;
    }

    const additionalProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};

    if (shouldOpenInNewTab) {
      additionalProps.target = "_blank";
      additionalProps.rel = "noopener noreferrer";
    }

    const protocol = href.substring(0, href.indexOf(":"));
    if (["http", "https", "tel", "mailto"].includes(protocol)) {
      // The content is passed as children.
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a {...rest} {...additionalProps} href={href} ref={ref} />;
    }

    href = resolveUrl(router.asPath, href);

    return (
      <NextLink href={href}>
        {/* The content is passed as children. */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a {...rest} {...additionalProps} ref={ref} />
      </NextLink>
    );
  }
);
