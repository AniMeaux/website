import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

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

export type LinkItemProps = LinkProps & ItemProps;
export const LinkItem = React.forwardRef<HTMLAnchorElement, LinkItemProps>(
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
      <Link
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

export const ButtonItem = React.forwardRef<HTMLButtonElement, ButtonItemProps>(
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

export type ItemIconProps = StyleProps & ChildrenProp;
export function ItemIcon({ className, ...rest }: ItemIconProps) {
  return <span {...rest} className={cn("ItemIcon", className)} />;
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
