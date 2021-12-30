import { BaseLink, BaseLinkProps } from "core/baseLink";
import { ChildrenProp, StyleProps } from "core/types";
import { forwardRef } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
} from "styled-components/macro";
import { theme } from "styles/theme";

type ItemColor = "default" | "red" | "yellow" | "blue";

const ITEM_COLOR_STYLES: Record<ItemColor, FlattenSimpleInterpolation> = {
  default: css``,
  red: css`
    color: ${theme.colors.alert[500]};
    font-weight: 500;
  `,
  yellow: css`
    color: ${theme.colors.warning[500]};
    font-weight: 500;
  `,
  blue: css`
    color: ${theme.colors.primary[500]};
    font-weight: 500;
  `,
};

const ITEM_COMMON_STYLES = css<{ $isHighlighted: boolean; $color: ItemColor }>`
  ${(props) => ITEM_COLOR_STYLES[props.$color]};
  width: 100%;
  border-radius: ${theme.borderRadius.m};
  padding: ${theme.spacing.x2};
  background: ${(props) =>
    props.$isHighlighted ? theme.colors.dark[50] : "none"};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.x4};
`;

export type ItemProps = StyleProps &
  ChildrenProp & {
    highlight?: boolean;
    color?: ItemColor;
  };

export function Item({
  highlight = false,
  color = "default",
  ...rest
}: ItemProps) {
  return <ItemElement {...rest} $isHighlighted={highlight} $color={color} />;
}

const ItemElement = styled.span`
  ${ITEM_COMMON_STYLES};
`;

const ITEM_ACTION_COMMON_PROPS = css`
  ${ITEM_COMMON_STYLES};
  text-align: left;

  /* Make sure the outline is not hidden by near elements. */
  &:focus {
    z-index: 1;
    position: relative;
  }

  &[aria-disabled],
  &:disabled {
    opacity: ${theme.opacity.disabled};
  }

  @media (hover: hover) {
    &:not([aria-disabled]):not(:disabled):hover {
      background: ${(props) =>
        props.$isHighlighted ? theme.colors.dark[100] : theme.colors.dark[30]};
    }
  }

  &:not([aria-disabled]):not(:disabled):active {
    background: ${(props) =>
      props.$isHighlighted ? theme.colors.dark[200] : theme.colors.dark[50]};
  }
`;

export type LinkItemProps = BaseLinkProps & ItemProps;

export const LinkItem = forwardRef<HTMLAnchorElement, LinkItemProps>(
  function LinkItem({ highlight = false, color = "default", ...rest }, ref) {
    return (
      <LinkItemElement
        {...rest}
        ref={ref}
        $isHighlighted={highlight}
        $color={color}
      />
    );
  }
);

const LinkItemElement = styled(BaseLink)`
  ${ITEM_ACTION_COMMON_PROPS};
`;

export type ButtonItemProps = ItemProps & {
  title?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ButtonItem = forwardRef<HTMLButtonElement, ButtonItemProps>(
  function ButtonItem({ highlight = false, color = "default", ...rest }, ref) {
    return (
      <ButtonItemElement
        {...rest}
        ref={ref}
        $isHighlighted={highlight}
        $color={color}
      />
    );
  }
);

const ButtonItemElement = styled.button`
  ${ITEM_ACTION_COMMON_PROPS};
`;

type ItemIconProps = StyleProps &
  ChildrenProp & {
    small?: boolean;
  };

export function ItemIcon({ small = false, ...rest }: ItemIconProps) {
  return <ItemIconElement {...rest} $isSmall={small} />;
}

const ItemIconElement = styled.span<{ $isSmall: boolean }>`
  flex: none;
  min-height: calc(${theme.typography.lineHeight.monoLine} * 1rem);
  align-self: flex-start;
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.$isSmall ? "inherit" : "24px")};
`;

export const ItemContent = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const ItemMainText = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: ${theme.typography.lineHeight.multiLine};
`;

export const ItemSecondaryText = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const ItemActions = styled.span`
  margin-top: ${theme.spacing.x1};
  max-width: 100%;
`;
