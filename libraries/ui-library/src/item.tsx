import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "./core/types";
import { Link, LinkProps } from "./link";

type ItemSize = "small" | "medium" | "large";

const ItemSizeClassName: { [key in ItemSize]: string } = {
  small: "h-10 space-x-2",
  medium: "h-12 space-x-4",
  large: "h-16 space-x-4",
};

type ItemCommonProps = {
  size?: ItemSize;
};

const ItemBaseClassName = "w-full rounded-xl px-2 flex items-center";

export type ItemProps = StyleProps & ChildrenProp & ItemCommonProps;

export function Item({ size = "medium", className, children }: ItemProps) {
  return (
    <span className={cn(ItemBaseClassName, ItemSizeClassName[size], className)}>
      {children}
    </span>
  );
}

export type LinkItemProps = LinkProps & ItemCommonProps;

export function LinkItem({
  size = "medium",
  disabled = false,
  className,
  ...rest
}: LinkItemProps) {
  return (
    <Link
      {...rest}
      disabled={disabled}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500",
        ItemBaseClassName,
        ItemSizeClassName[size],
        { "opacity-60": disabled },
        className
      )}
    />
  );
}

export type ButtonItemProps = StyleProps &
  ChildrenProp &
  ItemCommonProps & {
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export function ButtonItem({
  size = "medium",
  disabled = false,
  className,
  children,
  onClick,
}: ButtonItemProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 text-left",
        ItemBaseClassName,
        ItemSizeClassName[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export function ItemIcon({ className, children }: StyleProps & ChildrenProp) {
  return (
    <span className={cn("flex-none text-lg text-gray-700", className)}>
      {children}
    </span>
  );
}

export function ItemContent({
  className,
  children,
}: StyleProps & ChildrenProp) {
  return (
    <span className={cn("flex-1 min-w-0 flex flex-col", className)}>
      {children}
    </span>
  );
}

export function ItemContentRow({
  className,
  children,
}: StyleProps & ChildrenProp) {
  return (
    <span className={cn("flex items-center justify-between", className)}>
      {children}
    </span>
  );
}

export function ItemMainText({
  className,
  children,
}: StyleProps & ChildrenProp) {
  return <span className={cn("flex-1 truncate", className)}>{children}</span>;
}

export function ItemSecondaryAction({
  className,
  children,
}: StyleProps & ChildrenProp) {
  return (
    <span
      className={cn(
        "ml-4 flex-none text-xs opacity-75 flex items-center",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ItemSecondaryText({
  className,
  children,
}: StyleProps & ChildrenProp) {
  return (
    <span className={cn("flex-1 truncate text-sm opacity-75", className)}>
      {children}
    </span>
  );
}
