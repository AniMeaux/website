import cn from "classnames";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { ChildrenProp, StyleProps } from "core/types";
import { forwardRef } from "react";

type ItemColor = "default" | "red" | "yellow";

const ItemColorClassName: Record<ItemColor, string> = {
  default: "",
  red: "Item--red",
  yellow: "Item--yellow",
};

export type ItemProps = StyleProps &
  ChildrenProp & {
    highlight?: boolean;
    color?: ItemColor;
  };

export function Item({
  className,
  highlight = false,
  color = "default",
  ...rest
}: ItemProps) {
  return (
    <span
      {...rest}
      className={cn(
        "Item",
        ItemColorClassName[color],
        { "Item--isHighlighted": highlight },
        className
      )}
    />
  );
}

export type LinkItemProps = BaseLinkProps & ItemProps;
export const LinkItem = forwardRef<HTMLAnchorElement, LinkItemProps>(
  function LinkItem(
    {
      disabled = false,
      highlight = false,
      color = "default",
      className,
      ...rest
    },
    ref
  ) {
    return (
      <BaseLink
        {...rest}
        ref={ref}
        disabled={disabled}
        className={cn(
          "Item Item--action",
          ItemColorClassName[color],
          {
            "Item--disabled": disabled,
            "Item--isHighlighted": highlight,
          },
          className
        )}
      />
    );
  }
);

export type ButtonItemProps = ItemProps & {
  title?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ButtonItem = forwardRef<HTMLButtonElement, ButtonItemProps>(
  function ButtonItem(
    {
      highlight = false,
      disabled = false,
      color = "default",
      className,
      ...rest
    },
    ref
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled}
        className={cn(
          "Item Item--action",
          ItemColorClassName[color],
          {
            "Item--disabled": disabled,
            "Item--isHighlighted": highlight,
          },
          className
        )}
      />
    );
  }
);

export type ItemIconProps = StyleProps &
  ChildrenProp & {
    small?: boolean;
  };

export function ItemIcon({ className, small = false, ...rest }: ItemIconProps) {
  return (
    <span
      {...rest}
      className={cn("ItemIcon", { "ItemIcon--small": small }, className)}
    />
  );
}

export type ItemContentProps = StyleProps & ChildrenProp;
export function ItemContent({ className, ...rest }: ItemContentProps) {
  return <span {...rest} className={cn("ItemContent", className)} />;
}

export type ItemMainTextProps = StyleProps & ChildrenProp;
export function ItemMainText({ className, ...rest }: ItemMainTextProps) {
  return <span {...rest} className={cn("ItemText", className)} />;
}

export type ItemSecondaryTextProps = StyleProps & ChildrenProp;
export function ItemSecondaryText({
  className,
  ...rest
}: ItemSecondaryTextProps) {
  return (
    <span {...rest} className={cn("ItemText ItemText--secondary", className)} />
  );
}

export type ItemActionsProps = StyleProps & ChildrenProp;
export function ItemActions({ className, ...rest }: ItemActionsProps) {
  return <span {...rest} className={cn("ItemActions", className)} />;
}
