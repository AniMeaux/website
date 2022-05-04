import NextLink from "next/link";
import { forwardRef } from "react";
import {
  addHistoryIndexToUrl,
  canGoBackHistory,
  getHistoryIndex,
  resolveUrl,
  useRouter,
} from "~/core/router";
import { A11yProps, ChildrenProp, StyleProps } from "~/core/types";

export type BaseLinkProps = ChildrenProp &
  StyleProps &
  A11yProps & {
    href: string;
    isBack?: boolean;
    backOffset?: number;
    shouldOpenInNewTarget?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

/**
 * Simple Wrapper around Next/Link component to Automatically add the anchor.
 */
export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function BaseLink(
    {
      href,
      isBack = false,
      backOffset = 1,
      disabled = false,
      shouldOpenInNewTarget = false,
      onClick,
      ...rest
    },
    ref
  ) {
    const router = useRouter();

    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.RefAttributes<HTMLAnchorElement> = {
      ref,
    };

    if (disabled) {
      return <span {...rest} {...commonProps} aria-disabled />;
    }

    if (shouldOpenInNewTarget) {
      commonProps.target = "_blank";
      commonProps.rel = "noopener noreferrer";
    }

    const protocol = href.substring(0, href.indexOf(":"));
    if (["http", "https", "tel", "mailto"].includes(protocol)) {
      return (
        // The content is passed as children.
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a {...rest} {...commonProps} href={href} onClick={onClick} />
      );
    }

    // Don't increment history index to allow multiple back navigations.
    const newHistoryIndex = getHistoryIndex(router) + (isBack ? 0 : 1);

    const resolvedHref = resolveUrl(router.asPath, href);
    const hrefWithHistoryIndex = addHistoryIndexToUrl(
      resolvedHref,
      newHistoryIndex
    );

    return (
      <NextLink href={hrefWithHistoryIndex} as={resolvedHref}>
        {/* The content is passed as children. */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a
          {...rest}
          {...commonProps}
          ref={ref}
          onClick={(event) => {
            onClick?.(event);

            // We rather use a real back navigation when it's possible.
            if (
              !event.isDefaultPrevented() &&
              isBack &&
              canGoBackHistory(router, backOffset)
            ) {
              event.preventDefault();
              window.history.go(-backOffset);
            }
          }}
        />
      </NextLink>
    );
  }
);
