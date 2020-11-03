import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

type ItemSize = "small" | "medium" | "large";
type ItemCommonProps = {
  size?: ItemSize;
  active?: boolean;
  disabled?: boolean;
};

export type ItemProps = React.HTMLAttributes<HTMLSpanElement> & ItemCommonProps;

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
        "w-full rounded-md px-2 flex items-center",
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
        "a11y-focus w-full rounded-md px-2 flex items-center md:hover:bg-black md:hover:bg-opacity-4",
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
