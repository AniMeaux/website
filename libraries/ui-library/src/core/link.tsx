import NextLink from "next/link";
import * as React from "react";
import {
  addHistoryIndexToUrl,
  canGoBackHistory,
  getHistoryIndex,
  resolveUrl,
  useRouter,
} from "./router";
import { A11yProps, ChildrenProp, StyleProps } from "./types";

export type LinkProps = ChildrenProp &
  StyleProps &
  A11yProps & {
    href: string;
    as?: string;
    isBack?: boolean;
    backOffset?: number;
    shouldOpenInNewTab?: boolean;
    disabled?: boolean;
  };

/**
 * Simple Wrapper around Next/Link component to Automatically add the anchor.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      href,
      as,
      isBack = false,
      backOffset = 1,
      disabled = false,
      shouldOpenInNewTab = false,
      ...rest
    },
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

    if (as != null) {
      as = resolveUrl(router.asPath, as);
    } else {
      as = href;
      href = addHistoryIndexToUrl(
        href,
        getHistoryIndex(router) +
          (isBack
            ? // Don't increment history index to allow multiple back navigations.
              0
            : 1)
      );
    }

    return (
      <NextLink href={href} as={as}>
        {/* The content is passed as children. */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a
          {...rest}
          {...additionalProps}
          ref={ref}
          onClick={(event) => {
            // We rather use a real back navigation when it's possible.
            if (isBack && canGoBackHistory(router, backOffset)) {
              event.preventDefault();
              window.history.go(-backOffset);
            }
          }}
        />
      </NextLink>
    );
  }
);
