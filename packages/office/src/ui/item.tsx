import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

type ItemProps = React.HTMLAttributes<HTMLSpanElement> & {
  large?: boolean;
};

export function Item({ large = false, className, ...rest }: ItemProps) {
  return (
    <span
      {...rest}
      className={cn(
        "w-full px-2 flex items-center space-x-4",
        { "h-16": large, "h-12": !large },
        className
      )}
    />
  );
}

export type LinkItemProps = LinkProps & ItemProps;

export function LinkItem({ large = false, className, ...rest }: LinkItemProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus w-full px-2 flex items-center space-x-4",
        { "h-16": large, "h-12": !large },
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
        "ml-4 flex-none text-xs text-gray-600 flex items-center",
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
      className={cn("flex-1 truncate text-sm text-gray-600", className)}
    />
  );
}
