import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from ".";
import { Link, LinkProps } from "./link";

type ItemCommonProps = {
  highlight?: boolean;
};

const ItemBaseClassName = "w-full rounded-xl p-2 flex items-center space-x-4";
const HighlightedItemClassName = "bg-blue-500 bg-opacity-10";

export type ItemProps = StyleProps & ChildrenProp & ItemCommonProps;

export function Item({ className, children, highlight = false }: ItemProps) {
  return (
    <span
      className={cn(
        ItemBaseClassName,
        { [HighlightedItemClassName]: highlight },
        className
      )}
    >
      {children}
    </span>
  );
}

export type LinkItemProps = LinkProps & ItemCommonProps;

export function LinkItem({
  disabled = false,
  highlight = false,
  className,
  ...rest
}: LinkItemProps) {
  return (
    <Link
      {...rest}
      disabled={disabled}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 active:bg-black active:bg-opacity-5",
        ItemBaseClassName,
        {
          "opacity-60": disabled,
          [HighlightedItemClassName]: highlight,
        },
        className
      )}
    />
  );
}

export type ButtonItemProps = StyleProps &
  ChildrenProp &
  ItemCommonProps & {
    title?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export function ButtonItem({
  highlight = false,
  disabled = false,
  className,
  ...rest
}: ButtonItemProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 text-left",
        ItemBaseClassName,
        {
          "active:bg-black active:bg-opacity-5": !highlight,
          [`${HighlightedItemClassName} active:bg-opacity-15`]: highlight,
          "opacity-60": disabled,
        },
        className
      )}
    />
  );
}

type ItemIconProps = StyleProps & ChildrenProp;

export function ItemIcon({ className, ...rest }: ItemIconProps) {
  return (
    <span
      {...rest}
      className={cn(
        "flex-none min-h-6 self-start flex items-center text-2xl",
        className
      )}
    />
  );
}

export function ItemContent({ className, ...rest }: StyleProps & ChildrenProp) {
  return (
    <span {...rest} className={cn("flex-1 min-w-0 flex flex-col", className)} />
  );
}

export function ItemMainText({
  className,
  ...rest
}: StyleProps & ChildrenProp) {
  return <span {...rest} className={cn("max-w-full", className)} />;
}

export function ItemSecondaryText({
  className,
  ...rest
}: StyleProps & ChildrenProp) {
  return (
    <span
      {...rest}
      className={cn("max-w-full text-sm text-black text-opacity-60", className)}
    />
  );
}
