import { ActionCommonProps, ACTION_COMMON_STYLES } from "core/actions/shared";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { forwardRef } from "react";
import styled from "styled-components/macro";

export type LinkProps = BaseLinkProps & ActionCommonProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { isIconOnly, size, variant, disabled, ...rest },
  ref
) {
  return (
    <LinkElement
      {...rest}
      ref={ref}
      disabled={disabled}
      $isIconOnly={isIconOnly}
      $size={size}
      $variant={variant}
    />
  );
});

const LinkElement = styled(BaseLink)`
  ${ACTION_COMMON_STYLES};
`;
