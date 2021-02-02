import cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "./link";

type ItemSize = "small" | "medium" | "large";
type ItemCommonProps = {
  size?: ItemSize;
  active?: boolean;
  disabled?: boolean;
};

export type ItemProps = React.HTMLAttributes<HTMLSpanElement> & ItemCommonProps;

const ITEM_BASE_CLASS_NAMES = "w-full rounded-md px-2 flex items-center";

const ItemSizeClasses: { [key in ItemSize]: string } = {
  large: "h-16 space-x-4",
  medium: "h-12 space-x-4",
  small: "h-10 space-x-2",
};

export function Item({
  size = "medium",
  active = false,
  disabled = false,
  className,
  ...rest
}: ItemProps) {
  return (
    <span
      {...rest}
      className={cn(
        ITEM_BASE_CLASS_NAMES,
        ItemSizeClasses[size],
        {
          "bg-black bg-opacity-5": active,
          "opacity-60": disabled,
        },
        className
      )}
    />
  );
}

export type LinkItemProps = LinkProps & ItemCommonProps;

export function LinkItem({
  size = "medium",
  active = false,
  disabled = false,
  className,
  ...rest
}: LinkItemProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus",
        ITEM_BASE_CLASS_NAMES,
        ItemSizeClasses[size],
        {
          "bg-black bg-opacity-5": active,
          "opacity-60": disabled,
        },
        className
      )}
    />
  );
}

export type ButtonItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ItemCommonProps, "active">;

export function ButtonItem({
  size = "medium",
  disabled = false,
  className,
  ...rest
}: ButtonItemProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        "a11y-focus text-left",
        ITEM_BASE_CLASS_NAMES,
        ItemSizeClasses[size],
        className
      )}
    />
  );
}

export function ItemIcon({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn("flex-none text-lg text-gray-700", className)}
    />
  );
}

export function ItemContent({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...rest} className={cn("flex-1 min-w-0 flex flex-col", className)} />
  );
}

export function ItemContentRow({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn("flex items-center justify-between", className)}
    />
  );
}

export function ItemMainText({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("flex-1 truncate", className)} />;
}

export function ItemSecondaryAction({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn(
        "ml-4 flex-none text-xs opacity-75 flex items-center",
        className
      )}
    />
  );
}

export function ItemSecondaryText({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn("flex-1 truncate text-sm opacity-75", className)}
    />
  );
}
