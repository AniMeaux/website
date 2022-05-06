import { forwardRef } from "react";
import styled from "styled-components";
import { ActionCommonProps, ACTION_COMMON_STYLES } from "~/core/actions/shared";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";

export type LinkProps = BaseLinkProps & ActionCommonProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant, disabled, ...rest },
  ref
) {
  return (
    <LinkElement {...rest} ref={ref} disabled={disabled} $variant={variant} />
  );
});

const LinkElement = styled(BaseLink)`
  ${ACTION_COMMON_STYLES};
`;
