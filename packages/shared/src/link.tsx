import NextLink from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

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
function resolve(from: string, to: string): string {
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
    return addQuery("/" + allSegments.join("/"), toQuery);
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

  return addQuery("/" + segments.join("/"), toQuery);
}

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  // Make it mandatory.
  href: string;
};

/**
 * Simple Wrapper around Next/Link component to Automatically add the anchor.
 */
export function Link({ href, ...rest }: LinkProps) {
  const router = useRouter();
  href = resolve(router.asPath, href);

  return (
    <NextLink href={href}>
      {/* The content is passed as children. */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...rest} />
    </NextLink>
  );
}
